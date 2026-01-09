'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  DemoConfig,
  ProductItem,
  ShippingIssueReason,
} from '@/types/demo-config';
import { formatOrderDate } from '@/types/demo-config';
import { useDemoConfig } from './DemoLayout';

// ============================================================================
// Types
// ============================================================================

type WizardStep = 'reason' | 'items' | 'review' | 'confirmation';

interface ShippingIssueWizardProps {
  config: DemoConfig;
  /** Callback when wizard completes */
  onComplete?: (data: ShippingIssueSubmission) => void;
  /** Callback to navigate away (e.g., to admin) */
  onNavigateToAdmin?: () => void;
  /** Initial step (for demo purposes) */
  initialStep?: WizardStep;
}

interface ShippingIssueSubmission {
  reason: ShippingIssueReason;
  reasonLabel: string;
  selectedItems: ProductItem[];
  confirmationNumber: string;
  submittedAt: Date;
}

// ============================================================================
// Constants
// ============================================================================

const REASON_OPTIONS: { value: ShippingIssueReason; label: string }[] = [
  { value: 'damaged', label: 'It was damaged' },
  { value: 'lost', label: 'It was lost in transit' },
  { value: 'stolen', label: 'It was marked delivered but was never received' },
  { value: 'wrong_item', label: 'I received the wrong item' },
  { value: 'other', label: 'Other issue' },
];

const STEP_ORDER: WizardStep[] = ['reason', 'items', 'review', 'confirmation'];

// ============================================================================
// Animation Variants
// ============================================================================

function getSlideVariants(direction: 'horizontal' | 'vertical', forward: boolean) {
  const offset = direction === 'horizontal' ? { x: forward ? 100 : -100 } : { y: forward ? 50 : -50 };
  const offsetExit = direction === 'horizontal' ? { x: forward ? -100 : 100 } : { y: forward ? -50 : 50 };

  return {
    initial: { opacity: 0, ...offset },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...offsetExit },
  };
}

// ============================================================================
// Step Components
// ============================================================================

interface StepReasonProps {
  config: DemoConfig;
  selectedReason: ShippingIssueReason | null;
  onSelectReason: (reason: ShippingIssueReason) => void;
  onNext: () => void;
}

function StepReason({ config, selectedReason, onSelectReason, onNext }: StepReasonProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="px-4">
        <h1 className="text-center text-2xl text-gray-800">What Happened?</h1>
        <p className="mt-1 text-center text-gray-500">Tell us what happened to your package.</p>
      </div>

      <section className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <fieldset>
          <legend className="sr-only">Reorder reasons</legend>
          <div>
            {REASON_OPTIONS.map((option, index) => (
              <label
                key={option.value}
                className={`text-sm font-medium text-gray-700 -mb-[1px] flex cursor-pointer items-center gap-3 border border-gray-200 bg-white p-4 last:mb-0 last:rounded-b-md focus:outline-none ${
                  index === 0 ? 'rounded-t-md' : ''
                } ${selectedReason === option.value ? 'bg-gray-50 border-gray-300' : ''}`}
              >
                <input
                  type="radio"
                  name="reason"
                  required
                  checked={selectedReason === option.value}
                  onChange={() => onSelectReason(option.value)}
                  className="size-4 border-gray-300"
                  style={{ accentColor: config.brand.primaryColor }}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onNext}
          disabled={!selectedReason}
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 font-medium shadow-sm hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 w-full md:w-1/2"
          style={{
            backgroundColor: config.brand.primaryColor,
            color: config.brand.onPrimaryColor,
            outlineColor: config.brand.primaryColor,
          }}
        >
          <span>Next</span>
        </button>
      </section>
    </section>
  );
}

interface StepItemsProps {
  config: DemoConfig;
  selectedItemIds: Set<string>;
  onToggleItem: (itemId: string) => void;
  onNext: () => void;
}

function StepItems({ config, selectedItemIds, onToggleItem, onNext }: StepItemsProps) {
  const items = config.order.items;

  return (
    <section className="flex flex-col gap-4">
      <div className="px-4">
        <h1 className="text-center text-2xl text-gray-800">Which items were affected?</h1>
      </div>

      <section className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <fieldset className="divide-y divide-gray-200">
          <legend className="sr-only">Order Items</legend>
          {items.map((item) => (
            <div key={item.id} className="w-full flex flex-row items-center gap-4 py-4 first:pt-0 last:pb-0">
              <label
                htmlFor={`item-${item.id}`}
                className="bg-transparent text-sm font-medium text-gray-700 flex w-full items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex-1">
                  <article className="flex flex-col gap-8 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-4">
                      <div className="relative rounded flex-shrink-0 self-start">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="rounded border border-gray-200 object-contain size-12"
                        />
                        <span className="inline-flex max-w-max items-center gap-x-1 whitespace-nowrap rounded-full border px-2 py-[0.15rem] text-xs bg-gray-50 border-gray-200 text-gray-800 absolute -right-2 -top-2">
                          <span className="sr-only">Quantity</span>
                          <span>{item.quantity}</span>
                        </span>
                      </div>
                      <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                        <div className="flex w-full justify-between text-gray-800">
                          <span>{item.name}</span>
                        </div>
                        {item.variant && <span className="font-normal">{item.variant}</span>}
                      </div>
                    </div>
                  </article>
                </div>
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  name="items"
                  checked={selectedItemIds.has(item.id)}
                  onChange={() => onToggleItem(item.id)}
                  className="size-5 rounded-md border-gray-300 p-0"
                  style={{ accentColor: config.brand.primaryColor }}
                />
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="button"
          onClick={onNext}
          disabled={selectedItemIds.size === 0}
          className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 font-medium shadow-sm hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 w-full md:w-1/2"
          style={{
            backgroundColor: config.brand.primaryColor,
            color: config.brand.onPrimaryColor,
            outlineColor: config.brand.primaryColor,
          }}
        >
          <span>Next</span>
        </button>
      </section>
    </section>
  );
}

interface StepReviewProps {
  config: DemoConfig;
  selectedReason: ShippingIssueReason;
  selectedItems: ProductItem[];
  onSubmit: () => void;
}

function StepReview({ config, selectedReason, selectedItems, onSubmit }: StepReviewProps) {
  const reasonLabel = REASON_OPTIONS.find((r) => r.value === selectedReason)?.label || selectedReason;
  const address = config.order.shippingAddress;

  return (
    <section className="flex flex-col gap-4">
      <div className="px-4">
        <h1 className="text-center text-2xl text-gray-800">A Quick Review</h1>
        <p className="mt-1 text-center text-gray-500">
          Here are the details of your request, does everything look right?
        </p>
      </div>

      {/* Request Card */}
      <section className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <header>
          <h2 className="text-left text-xl font-medium text-gray-800">Request</h2>
        </header>
        <dl className="[&>dd]:text-gray-800 [&>dt:first-of-type]:mt-0 [&>dt]:mt-4 [&>dt]:font-semibold">
          <dt>Reason:</dt>
          <dd>{reasonLabel}</dd>
        </dl>
      </section>

      {/* Items Card */}
      <section className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <header>
          <h2 className="text-left text-xl font-medium text-gray-800">Items</h2>
        </header>
        <div className="space-y-4">
          {selectedItems.map((item) => (
            <article key={item.id} className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="flex w-full items-center gap-4">
                <div className="relative rounded flex-shrink-0 self-start">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="rounded border border-gray-200 object-contain size-12"
                  />
                  <span className="inline-flex max-w-max items-center gap-x-1 whitespace-nowrap rounded-full border px-2 py-[0.15rem] text-xs bg-gray-50 border-gray-200 text-gray-800 absolute -right-2 -top-2">
                    <span className="sr-only">Quantity</span>
                    <span>{item.quantity}</span>
                  </span>
                </div>
                <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                  <div className="flex w-full justify-between text-gray-800">
                    <span>{item.name}</span>
                    <span className="hidden sm:block">{item.price}</span>
                  </div>
                  {item.variant && <span className="font-normal">{item.variant}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Address Card */}
      <section className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <header>
          <h2 className="text-left text-xl font-medium text-gray-800">Address</h2>
        </header>
        <address className="not-italic text-gray-700">
          <span>{address.name}</span>
          <br />
          <span>{address.line1}</span>
          {address.line2 && (
            <>
              <br />
              <span>{address.line2}</span>
            </>
          )}
          <br />
          <span>
            {address.city}, {address.state} {address.postalCode}
          </span>
          <br />
          <span>{address.country}</span>
        </address>
      </section>

      <button
        type="button"
        onClick={onSubmit}
        className="inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 font-medium shadow-sm hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline focus:outline-2 focus:outline-offset-2 w-full md:w-1/2"
        style={{
          backgroundColor: config.brand.primaryColor,
          color: config.brand.onPrimaryColor,
          outlineColor: config.brand.primaryColor,
        }}
      >
        <span>Submit Request</span>
      </button>
    </section>
  );
}

interface StepConfirmationProps {
  config: DemoConfig;
  confirmationNumber: string;
  submittedAt: Date;
  onNavigateToAdmin?: () => void;
}

function StepConfirmation({ config, confirmationNumber, submittedAt, onNavigateToAdmin }: StepConfirmationProps) {
  const supportDomain = config.brand.supportEmailDomain || config.brand.name.toLowerCase().replace(/\s+/g, '');

  return (
    <section className="flex flex-col gap-4">
      <div className="px-4">
        <h1 className="text-center text-2xl text-gray-800">We received your information</h1>
      </div>
      <p className="mt-1 text-center text-gray-500">
        You should be receiving an email with the next steps. If you don&apos;t hear from us, please reach out at{' '}
        <a
          className="hover:underline"
          href={`mailto:support@${supportDomain}.com`}
          style={{ color: config.brand.primaryColor }}
        >
          support@{supportDomain}.com
        </a>
      </p>

      <section className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-8">
        <header>
          <h2 className="text-left text-xl font-medium text-gray-800">Shipping Support Request</h2>
        </header>
        <dl className="grid grid-cols-2 divide-y divide-gray-200 *:py-2 [&>dd]:text-right [&>dd]:text-gray-700 [&>dd:first-of-type]:!border-t-0">
          <dt>Confirmation</dt>
          <dd>#{confirmationNumber}</dd>
          <dt>Status</dt>
          <dd>Open</dd>
          <dt>Created</dt>
          <dd>{formatOrderDate(submittedAt)}</dd>
        </dl>
      </section>

      {onNavigateToAdmin && (
        <button
          type="button"
          onClick={onNavigateToAdmin}
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 font-medium shadow-sm hover:brightness-90 focus:outline focus:outline-2 focus:outline-offset-2 w-full md:w-1/2"
          style={{
            borderColor: config.brand.primaryColor,
            color: config.brand.primaryColor,
            outlineColor: config.brand.primaryColor,
          }}
        >
          <span>View in Admin</span>
        </button>
      )}
    </section>
  );
}

// ============================================================================
// Main Wizard Component
// ============================================================================

export function ShippingIssueWizard({
  config,
  onComplete,
  onNavigateToAdmin,
  initialStep = 'reason',
}: ShippingIssueWizardProps) {
  // State
  const [currentStep, setCurrentStep] = useState<WizardStep>(initialStep);
  const [selectedReason, setSelectedReason] = useState<ShippingIssueReason | null>(
    config.shippingIssue?.defaultReason || null
  );
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(config.shippingIssue?.defaultSelectedItems || config.order.items.map((i) => i.id))
  );
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Derived state
  const selectedItems = useMemo(
    () => config.order.items.filter((item) => selectedItemIds.has(item.id)),
    [config.order.items, selectedItemIds]
  );

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);

  // Handlers
  const goToStep = useCallback((step: WizardStep) => {
    const newIndex = STEP_ORDER.indexOf(step);
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    setDirection(newIndex > currentIndex ? 'forward' : 'backward');
    setCurrentStep(step);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setDirection('forward');
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  }, [currentStepIndex]);

  const handleToggleItem = useCallback((itemId: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const confNum = String(Math.floor(Math.random() * 900) + 100);
    const now = new Date();

    setConfirmationNumber(confNum);
    setSubmittedAt(now);
    setDirection('forward');
    setCurrentStep('confirmation');

    const reasonLabel = REASON_OPTIONS.find((r) => r.value === selectedReason)?.label || '';

    onComplete?.({
      reason: selectedReason!,
      reasonLabel,
      selectedItems,
      confirmationNumber: confNum,
      submittedAt: now,
    });
  }, [selectedReason, selectedItems, onComplete]);

  // Animation config
  const slideDirection = config.animation.slideDirection;
  const variants = getSlideVariants(slideDirection, direction === 'forward');

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          initial={config.animation.enabled ? 'initial' : false}
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            duration: config.animation.duration,
            ease: config.animation.easing === 'spring' ? [0.34, 1.56, 0.64, 1] : config.animation.easing,
          }}
        >
          {currentStep === 'reason' && (
            <StepReason
              config={config}
              selectedReason={selectedReason}
              onSelectReason={setSelectedReason}
              onNext={handleNext}
            />
          )}

          {currentStep === 'items' && (
            <StepItems
              config={config}
              selectedItemIds={selectedItemIds}
              onToggleItem={handleToggleItem}
              onNext={handleNext}
            />
          )}

          {currentStep === 'review' && selectedReason && (
            <StepReview
              config={config}
              selectedReason={selectedReason}
              selectedItems={selectedItems}
              onSubmit={handleSubmit}
            />
          )}

          {currentStep === 'confirmation' && submittedAt && (
            <StepConfirmation
              config={config}
              confirmationNumber={confirmationNumber}
              submittedAt={submittedAt}
              onNavigateToAdmin={onNavigateToAdmin}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step Indicator (optional - for debugging/demo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 flex justify-center gap-2">
          {STEP_ORDER.map((step, index) => (
            <button
              key={step}
              onClick={() => goToStep(step)}
              className={`size-3 rounded-full transition-colors ${
                index === currentStepIndex
                  ? 'bg-gray-800'
                  : index < currentStepIndex
                  ? 'bg-gray-400'
                  : 'bg-gray-200'
              }`}
              aria-label={`Go to step ${index + 1}: ${step}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Export individual steps for flexibility
// ============================================================================

export { StepReason, StepItems, StepReview, StepConfirmation };
export type { WizardStep, ShippingIssueSubmission };
