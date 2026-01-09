/**
 * Corso Demo Studio - Configuration Schema
 *
 * This schema defines all customizable aspects of a sales demo.
 * Pass a `DemoConfig` object to any demo component to customize branding,
 * products, and behavior.
 */

// ============================================================================
// Brand Configuration
// ============================================================================

export interface BrandConfig {
  /** Display name of the merchant (e.g., "NOMATIC") */
  name: string;
  /** URL to the brand's logo image */
  logoUrl: string;
  /** Primary brand color (hex, e.g., "#000000") */
  primaryColor: string;
  /** Text color on primary backgrounds (hex, e.g., "#ffffff") */
  onPrimaryColor: string;
  /** Optional banner background color */
  bannerColor?: string;
  /** Optional banner background image URL */
  bannerImageUrl?: string;
  /** Support email domain (e.g., "nomatic" for support@nomatic.com) */
  supportEmailDomain?: string;
}

// ============================================================================
// Product & Order Configuration
// ============================================================================

export interface ProductItem {
  /** Unique identifier for the product */
  id: string;
  /** Display name */
  name: string;
  /** Product variant (e.g., "Gray / Large") */
  variant?: string;
  /** Price as formatted string (e.g., "$349.00") */
  price: string;
  /** Quantity in the order */
  quantity: number;
  /** Product image URL */
  imageUrl: string;
  /** SKU for admin display */
  sku?: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TrackingEvent {
  date: Date;
  status: string;
  description: string;
}

export interface TrackingInfo {
  carrier: 'usps' | 'ups' | 'fedex' | 'dhl' | 'other';
  trackingNumber: string;
  status: 'pre_transit' | 'in_transit' | 'delivered' | 'exception';
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  events: TrackingEvent[];
}

export interface OrderConfig {
  /** Order number for display */
  orderNumber: string;
  /** Order date */
  orderDate: Date;
  /** Items in the order */
  items: ProductItem[];
  /** Shipping address */
  shippingAddress: ShippingAddress;
  /** Tracking information */
  tracking?: TrackingInfo;
}

// ============================================================================
// Demo Feature Flags
// ============================================================================

export interface DemoFeatures {
  /** Show shipping protection / GSP features */
  showShippingProtection: boolean;
  /** Show returns & exchanges flow */
  showReturns: boolean;
  /** Show warranty registration & claims */
  showWarranties: boolean;
  /** Show order editing features */
  showOrderEdit: boolean;
  /** Enable the admin panel demo */
  showAdminPanel: boolean;
}

// ============================================================================
// Wizard Configuration
// ============================================================================

export type ShippingIssueReason = 'damaged' | 'lost' | 'stolen' | 'wrong_item' | 'other';

export interface ShippingIssueConfig {
  /** Pre-selected reason (for demo flow) */
  defaultReason?: ShippingIssueReason;
  /** Pre-selected item IDs (for demo flow) */
  defaultSelectedItems?: string[];
  /** Available resolution options */
  resolutionOptions: ('replacement' | 'refund' | 'store_credit')[];
}

export type ReturnReason =
  | 'too_small'
  | 'too_large'
  | 'not_as_expected'
  | 'changed_mind'
  | 'defective'
  | 'other';

export interface ReturnsConfig {
  /** Return window in days */
  returnWindowDays: number;
  /** Available return reasons */
  availableReasons: ReturnReason[];
  /** Enable exchanges */
  allowExchanges: boolean;
  /** Enable store credit option */
  allowStoreCredit: boolean;
  /** Enable shop now (bonus credit) flow */
  allowShopNow: boolean;
  /** Bonus credit percentage for shop now */
  shopNowBonusPercent?: number;
}

// ============================================================================
// Admin Configuration
// ============================================================================

export interface AdminConfig {
  /** Current user name for display */
  userName: string;
  /** Store/merchant identifier */
  storeId: string;
  /** Store display name */
  storeName: string;
  /** Available navigation items */
  enabledModules: ('shipping' | 'returns' | 'warranties' | 'registrations' | 'analytics')[];
}

// ============================================================================
// Animation Configuration
// ============================================================================

export interface AnimationConfig {
  /** Enable/disable all animations */
  enabled: boolean;
  /** Transition duration in seconds */
  duration: number;
  /** Easing function */
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  /** Slide direction for wizard steps */
  slideDirection: 'horizontal' | 'vertical';
}

// ============================================================================
// Main Demo Configuration
// ============================================================================

export interface DemoConfig {
  /** Unique demo session ID */
  id: string;
  /** Brand customization */
  brand: BrandConfig;
  /** Order data */
  order: OrderConfig;
  /** Feature toggles */
  features: DemoFeatures;
  /** Shipping issue wizard settings */
  shippingIssue?: ShippingIssueConfig;
  /** Returns wizard settings */
  returns?: ReturnsConfig;
  /** Admin panel settings */
  admin?: AdminConfig;
  /** Animation preferences */
  animation: AnimationConfig;
}

// ============================================================================
// Default Configuration Factory
// ============================================================================

export function createDefaultDemoConfig(overrides?: Partial<DemoConfig>): DemoConfig {
  const now = new Date();
  const orderDate = new Date(now);
  orderDate.setDate(now.getDate() - 7);

  const deliveredDate = new Date(now);
  deliveredDate.setDate(now.getDate() - 1);

  return {
    id: crypto.randomUUID(),
    brand: {
      name: 'NOMATIC',
      logoUrl: 'https://cdn.corso.com/img/Corso_Horizontal-Lockup_Black.png',
      primaryColor: '#000000',
      onPrimaryColor: '#ffffff',
      bannerColor: '#edeae5',
      supportEmailDomain: 'nomatic',
    },
    order: {
      orderNumber: '3183',
      orderDate,
      items: [
        {
          id: '109137',
          name: 'Method Luggage Carry-On',
          variant: 'Gray',
          price: '$349.00',
          quantity: 1,
          imageUrl: 'https://cdn.shopify.com/s/files/1/0732/6125/2917/files/RLMDCN-GRY-01_MethodLuggageCheckIn_GREY_NOMATIC_05_MAIN.webp?v=1730222985',
          sku: 'RLMDCN-GRY-01',
        },
      ],
      shippingAddress: {
        name: 'Carl Smiles',
        line1: '223 Erbes Road',
        city: 'Thousand Oaks',
        state: 'CA',
        postalCode: '91362',
        country: 'US',
      },
      tracking: {
        carrier: 'usps',
        trackingNumber: '9261290318446315187969',
        status: 'delivered',
        deliveredAt: deliveredDate,
        events: [
          {
            date: deliveredDate,
            status: 'Delivered',
            description: 'Shipment has been delivered',
          },
          {
            date: new Date(now.setDate(now.getDate() - 2)),
            status: 'In Transit',
            description: 'Shipment is in transit',
          },
          {
            date: new Date(now.setDate(now.getDate() - 3)),
            status: 'Getting Ready To Ship',
            description: 'Label has been generated',
          },
        ],
      },
    },
    features: {
      showShippingProtection: true,
      showReturns: true,
      showWarranties: false,
      showOrderEdit: true,
      showAdminPanel: true,
    },
    shippingIssue: {
      resolutionOptions: ['replacement', 'refund'],
    },
    returns: {
      returnWindowDays: 30,
      availableReasons: ['too_small', 'too_large', 'not_as_expected', 'changed_mind', 'defective', 'other'],
      allowExchanges: true,
      allowStoreCredit: true,
      allowShopNow: true,
      shopNowBonusPercent: 10,
    },
    admin: {
      userName: 'Demo User',
      storeId: '975',
      storeName: 'lunas-sobre-mi-jamon',
      enabledModules: ['shipping', 'returns', 'analytics'],
    },
    animation: {
      enabled: true,
      duration: 0.3,
      easing: 'ease-out',
      slideDirection: 'horizontal',
    },
    ...overrides,
  };
}

// ============================================================================
// Type Guards & Utilities
// ============================================================================

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function formatOrderDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRelativeDate(daysFromToday: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date;
}
