"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoConfig } from "@/lib/demo-context";
import type { ProductItem, ReturnReason } from "@/types/demo-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type Step = "reason" | "detail" | "exchange" | "review" | "success";

interface ReturnWizardState {
  selectedItems: string[];
  returnReason: ReturnReason | null;
  returnDetail: string | null;
  exchangeMethod: "exchange" | "refund" | null;
  exchangeProductId: string | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

const returnReasonLabels: Record<ReturnReason, string> = {
  too_small: "Too Small",
  too_large: "Too Large",
  not_as_expected: "Not as Expected",
  changed_mind: "Changed Mind",
  defective: "Defective",
  other: "Other",
};

// ============================================================================
// Step 1: Reasons Step (Item Selection)
// ============================================================================

interface ReasonsStepProps {
  items: ProductItem[];
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
}

function ReasonsStep({ items, selectedItems, onSelectItem }: ReasonsStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 sr-only">
        <h1 className="text-center text-2xl text-gray-800">
          What happened and how can we make it right?
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            The product you will be returning
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <article
                key={item.id}
                className={cn(
                  "flex flex-col gap-8 sm:flex-row sm:items-center cursor-pointer rounded-md border p-4 transition-colors",
                  isSelected
                    ? "border-[var(--brand-primary)] bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => onSelectItem(item.id)}
              >
                <div className="flex w-full items-center gap-4">
                  <div className="relative rounded flex-shrink-0 self-start">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="rounded border border-gray-200 object-contain size-12"
                    />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-[var(--brand-primary)] text-white">
                          <Check className="size-3" />
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                    <div className="flex w-full justify-between text-gray-800">
                      <span>{item.name}</span>
                      <span className="hidden sm:block">{item.price}</span>
                    </div>
                    {item.variant && (
                      <span className="font-normal">{item.variant}</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Step 2: Detail Step (Return Reason)
// ============================================================================

interface DetailStepProps {
  availableReasons: ReturnReason[];
  selectedReason: ReturnReason | null;
  onSelectReason: (reason: ReturnReason) => void;
  selectedItem: ProductItem | null;
}

function DetailStep({
  availableReasons,
  selectedReason,
  onSelectReason,
  selectedItem,
}: DetailStepProps) {
  if (!selectedItem) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 sr-only">
        <h1 className="text-center text-2xl text-gray-800">
          What happened and how can we make it right?
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            The product you will be returning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <article className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-4">
              <div className="relative rounded flex-shrink-0 self-start">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="rounded border border-gray-200 object-contain size-12"
                />
              </div>
              <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                <div className="flex w-full justify-between text-gray-800">
                  <span>{selectedItem.name}</span>
                  <span className="hidden sm:block">{selectedItem.price}</span>
                </div>
                {selectedItem.variant && (
                  <span className="font-normal">{selectedItem.variant}</span>
                )}
              </div>
            </div>
          </article>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            Why are you submitting this item for return?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedReason || undefined}
            onValueChange={(value) => onSelectReason(value as ReturnReason)}
          >
            <div className="space-y-0">
              {availableReasons.map((reason, index) => (
                <div
                  key={reason}
                  className={cn(
                    "-mb-[1px] flex cursor-pointer items-center gap-3 border border-gray-200 bg-white p-4 last:mb-0 last:rounded-b-md focus-within:outline-none",
                    index === 0 && "rounded-t-md"
                  )}
                >
                  <RadioGroupItem value={reason} id={reason} />
                  <Label
                    htmlFor={reason}
                    className="flex-1 cursor-pointer text-sm font-medium text-gray-700"
                  >
                    {returnReasonLabels[reason]}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Step 3: Exchange Step
// ============================================================================

interface ExchangeStepProps {
  allowExchanges: boolean;
  allowStoreCredit: boolean;
  exchangeMethod: "exchange" | "refund" | null;
  onSelectMethod: (method: "exchange" | "refund") => void;
  selectedItem: ProductItem | null;
}

function ExchangeStep({
  allowExchanges,
  allowStoreCredit,
  exchangeMethod,
  onSelectMethod,
  selectedItem,
}: ExchangeStepProps) {
  if (!selectedItem) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4 sr-only">
        <h1 className="text-center text-2xl text-gray-800">
          What happened and how can we make it right?
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            The product you will be returning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <article className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-4">
              <div className="relative rounded flex-shrink-0 self-start">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="rounded border border-gray-200 object-contain size-12"
                />
              </div>
              <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                <div className="flex w-full justify-between text-gray-800">
                  <span>{selectedItem.name}</span>
                  <span className="hidden sm:block">{selectedItem.price}</span>
                </div>
                {selectedItem.variant && (
                  <span className="font-normal">{selectedItem.variant}</span>
                )}
              </div>
            </div>
          </article>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            What would you like to do?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={exchangeMethod || undefined}
            onValueChange={(value) => onSelectMethod(value as "exchange" | "refund")}
          >
            <div className="space-y-0">
              {allowExchanges && (
                <div
                  className={cn(
                    "-mb-[1px] flex cursor-pointer items-center gap-3 border border-gray-200 bg-white p-4 first:rounded-t-md last:mb-0 last:rounded-b-md transition-colors",
                    exchangeMethod === "exchange" && "border-[var(--brand-primary)] bg-gray-50"
                  )}
                  onClick={() => onSelectMethod("exchange")}
                >
                  <RadioGroupItem value="exchange" id="exchange" />
                  <Label htmlFor="exchange" className="flex-1 cursor-pointer text-sm font-medium text-gray-700">
                    Exchange for a different item
                  </Label>
                </div>
              )}
              <div
                className={cn(
                  "-mb-[1px] flex cursor-pointer items-center gap-3 border border-gray-200 bg-white p-4 first:rounded-t-md last:mb-0 last:rounded-b-md transition-colors",
                  exchangeMethod === "refund" && "border-[var(--brand-primary)] bg-gray-50"
                )}
                onClick={() => onSelectMethod("refund")}
              >
                <RadioGroupItem value="refund" id="refund" />
                <Label htmlFor="refund" className="flex-1 cursor-pointer text-sm font-medium text-gray-700">
                  Refund to original payment method
                </Label>
              </div>
              {allowStoreCredit && (
                <div
                  className={cn(
                    "-mb-[1px] flex cursor-pointer items-center gap-3 border border-gray-200 bg-white p-4 first:rounded-t-md last:mb-0 last:rounded-b-md transition-colors",
                    exchangeMethod === "refund" && "border-[var(--brand-primary)] bg-gray-50"
                  )}
                  onClick={() => onSelectMethod("refund")}
                >
                  <RadioGroupItem value="store_credit" id="store_credit" />
                  <Label htmlFor="store_credit" className="flex-1 cursor-pointer text-sm font-medium text-gray-700">
                    Store Credit
                  </Label>
                </div>
              )}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Step 4: Review Step
// ============================================================================

interface ReviewStepProps {
  state: ReturnWizardState;
  selectedItem: ProductItem | null;
}

function ReviewStep({ state, selectedItem }: ReviewStepProps) {
  if (!selectedItem) return null;

  const returnCredit = selectedItem.price.replace("$", "");
  const shopNowBonus = state.returnReason === "changed_mind" ? 10 : 0;
  const totalCredit = parseFloat(returnCredit) + shopNowBonus;

  return (
    <div className="flex flex-col gap-4">
      <header className="px-4">
        <h1 className="text-center text-2xl text-gray-800">Return Summary</h1>
        <p className="mt-1 text-center text-gray-500">
          Review your decisions before submitting your request
        </p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col divide-y divide-gray-200">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-gray-800 marker:hidden">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1">
                    Return Credit
                  </div>
                  <span>${totalCredit.toFixed(2)}</span>
                </div>
              </summary>
              <div className="mt-2">
                <div className="flex flex-col gap-2 rounded-md bg-gray-50 text-sm text-gray-700 p-2">
                  <p className="text-sm">Return Item (1)</p>
                  <article className="flex flex-col gap-8 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-4">
                      <div className="relative">
                        <img
                          src={selectedItem.imageUrl}
                          alt={selectedItem.name}
                          className="rounded border border-gray-200 object-contain size-12"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-gray-50 border-gray-200 text-gray-800">
                          1
                        </Badge>
                      </div>
                      <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                        <div className="flex w-full justify-between text-gray-800">
                          <span>{selectedItem.name}</span>
                          <span className="hidden sm:block">
                            {selectedItem.price} x 1
                          </span>
                        </div>
                        {selectedItem.variant && (
                          <span className="font-normal">{selectedItem.variant}</span>
                        )}
                      </div>
                    </div>
                  </article>
                  {shopNowBonus > 0 && (
                    <div className="flex justify-between p-2">
                      <span>Shop Now Incentive</span>
                      <span>${shopNowBonus.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </details>

            {state.exchangeMethod === "exchange" && (
              <details className="group py-4" open>
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-gray-800 marker:hidden">
                  <div className="flex w-full items-center justify-between">
                    Exchange Item
                  </div>
                </summary>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Exchange product selection will be shown here
                  </p>
                </div>
              </details>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Step 5: Success Step
// ============================================================================

interface SuccessStepProps {
  selectedItem: ProductItem | null;
  confirmationNumber: string;
}

function SuccessStep({ selectedItem, confirmationNumber }: SuccessStepProps) {
  if (!selectedItem) return null;

  const returnByDate = new Date();
  returnByDate.setDate(returnByDate.getDate() + 14);

  return (
    <div className="flex flex-col gap-4">
      <header className="px-4">
        <h1 className="text-center text-2xl text-gray-800">
          We received your request
        </h1>
        <p className="mt-1 text-center text-gray-500">
          Confirmation number: #{confirmationNumber}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            Return Items By:{" "}
            <span>{returnByDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}</span>
          </CardTitle>
          <p className="text-gray-500">
            Please use the provided QR Code to return your items
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col divide-y divide-gray-200">
            <article className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="rounded border border-gray-200 object-contain size-12"
                  />
                  <Badge className="absolute -top-2 -right-2 bg-gray-50 border-gray-200 text-gray-800">
                    1
                  </Badge>
                </div>
                <div className="flex w-full flex-col gap-1 text-sm font-medium text-gray-500">
                  <div className="flex w-full justify-between text-gray-800">
                    <span>{selectedItem.name}</span>
                    <span>{selectedItem.price}</span>
                  </div>
                  {selectedItem.variant && (
                    <span className="font-normal">{selectedItem.variant}</span>
                  )}
                </div>
              </div>
            </article>
          </div>

          <figure className="flex w-full flex-col items-center self-center rounded-lg border border-gray-200 sm:flex-row sm:items-stretch">
            <div className="flex basis-1/2 items-center justify-center">
              <img
                alt="QR Code for shipping label"
                className="w-72 p-4"
                src="https://corso-crew-stg.sfo3.cdn.digitaloceanspaces.com/image/shipping-label-qr-code/2026-01-07t04-07-30-506z-49b4fac26e8a4ae69bd3b13b54110d36.png"
              />
            </div>
            <figcaption className="flex w-full basis-1/2 items-center justify-center rounded-tr-none rounded-br-lg rounded-bl-lg border-t border-gray-200 bg-gray-50 p-4 sm:rounded-tr-lg sm:rounded-bl-none sm:border-t-0 sm:border-l">
              <dl className="grid w-full grid-cols-1 justify-start gap-2">
                <div>
                  <dt className="text-sm text-gray-500 uppercase">Confirmation</dt>
                  <dd className="text-base">#{confirmationNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 uppercase">Carrier</dt>
                  <dd className="text-base">USPS</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 uppercase">To</dt>
                  <dd className="text-base">Ship Lion</dd>
                </div>
              </dl>
            </figcaption>
          </figure>

          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              variant="outline"
              className="w-full md:w-1/2"
              style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}
            >
              Download Return Label
            </Button>
            <Button
              variant="outline"
              className="w-full md:w-1/2"
              style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}
            >
              Back To Our Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Main ReturnsWizard Component
// ============================================================================

export function ReturnsWizard() {
  const { config } = useDemoConfig();
  const [step, setStep] = useState<Step>("reason");
  const [state, setState] = useState<ReturnWizardState>({
    selectedItems: [],
    returnReason: null,
    returnDetail: null,
    exchangeMethod: null,
    exchangeProductId: null,
  });

  const items = config.order.items;
  const returnsConfig = config.returns;
  const selectedItem = items.find((item) => state.selectedItems.includes(item.id)) || items[0] || null;

  const handleSelectItem = (itemId: string) => {
    setState((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(itemId)
        ? prev.selectedItems.filter((id) => id !== itemId)
        : [...prev.selectedItems, itemId],
    }));
  };

  const handleNext = () => {
    switch (step) {
      case "reason":
        if (state.selectedItems.length > 0) {
          setStep("detail");
        }
        break;
      case "detail":
        if (state.returnReason) {
          if (returnsConfig?.allowExchanges) {
            setStep("exchange");
          } else {
            setStep("review");
          }
        }
        break;
      case "exchange":
        if (state.exchangeMethod) {
          setStep("review");
        }
        break;
      case "review":
        setStep("success");
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case "detail":
        setStep("reason");
        break;
      case "exchange":
        setStep("detail");
        break;
      case "review":
        if (returnsConfig?.allowExchanges) {
          setStep("exchange");
        } else {
          setStep("detail");
        }
        break;
    }
  };

  const canProceed = () => {
    switch (step) {
      case "reason":
        return state.selectedItems.length > 0;
      case "detail":
        return state.returnReason !== null;
      case "exchange":
        return state.exchangeMethod !== null;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={stepVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {step === "reason" && (
            <ReasonsStep
              items={items}
              selectedItems={state.selectedItems}
              onSelectItem={handleSelectItem}
            />
          )}
          {step === "detail" && (
            <DetailStep
              availableReasons={returnsConfig?.availableReasons || []}
              selectedReason={state.returnReason}
              onSelectReason={(reason) =>
                setState((prev) => ({ ...prev, returnReason: reason }))
              }
              selectedItem={selectedItem}
            />
          )}
          {step === "exchange" && (
            <ExchangeStep
              allowExchanges={returnsConfig?.allowExchanges || false}
              allowStoreCredit={returnsConfig?.allowStoreCredit || false}
              exchangeMethod={state.exchangeMethod}
              onSelectMethod={(method) =>
                setState((prev) => ({ ...prev, exchangeMethod: method }))
              }
              selectedItem={selectedItem}
            />
          )}
          {step === "review" && (
            <ReviewStep state={state} selectedItem={selectedItem} />
          )}
          {step === "success" && (
            <SuccessStep
              selectedItem={selectedItem}
              confirmationNumber="985-1202-1"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {step !== "success" && (
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === "reason"}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--brand-on-primary)",
            }}
          >
            {step === "review" ? "Submit Return Request" : "Next"}
            {step !== "review" && <ArrowRight className="size-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
