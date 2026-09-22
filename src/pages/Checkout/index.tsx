import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore, useAuthStore } from '@/store';
import { ROUTES, orderConfirmationPath } from '@/constants/routes';
import { SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/constants/pricing';
import {
  addAddress,
  validateCoupon,
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  type ValidateCouponResult,
} from '@/services';
import { formatCurrency, cn, loadRazorpayScript } from '@/utils';
import { useDisclosure } from '@/hooks';
import type { Address } from '@/types';
import { Container, Button, Input, Select, Modal, Switch } from '@/components/ui';

type PaymentOption = 'razorpay' | 'cod';

const PAYMENT_OPTIONS: { value: PaymentOption; label: string }[] = [
  { value: 'razorpay', label: 'Online Payment (UPI / Card / Net Banking)' },
  { value: 'cod', label: 'Cash on Delivery' },
];

type AddressFormValues = Omit<Address, 'id'>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const { user, updateUser } = useAuthStore();
  const addressModal = useDisclosure();

  const addresses = user?.addresses ?? [];
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    () => addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id,
  );
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string>();
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResult>();
  const [addressFormError, setAddressFormError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting: isAddingAddress },
  } = useForm<AddressFormValues>({ defaultValues: { isDefault: false } });
  const isDefaultAddress = watch('isDefault');

  if (items.length === 0) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const sub = subtotal();
  const shipping = sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = appliedCoupon?.discount ?? 0;
  const total = sub - discount + shipping;

  const onAddAddress = async (values: AddressFormValues) => {
    try {
      setAddressFormError(undefined);
      const updatedUser = await addAddress(values);
      updateUser(updatedUser);
      setSelectedAddressId(updatedUser.addresses.at(-1)?.id);
      reset();
      addressModal.close();
    } catch (err) {
      setAddressFormError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const onApplyCoupon = async () => {
    try {
      setCouponError(undefined);
      setIsApplyingCoupon(true);
      setAppliedCoupon(await validateCoupon({ code: couponCode, subtotal: sub }));
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const onPlaceOrder = async () => {
    if (!selectedAddressId || !user) return;
    const cartItems = items.map((i) => ({ productId: i.productId, size: i.size, color: i.color, quantity: i.quantity }));

    if (paymentOption === 'cod') {
      try {
        setFormError(undefined);
        setIsPlacingOrder(true);
        const order = await createOrder({
          items: cartItems,
          addressId: selectedAddressId,
          paymentMethod: 'Cash on Delivery',
          couponCode: appliedCoupon?.code,
        });
        clearCart();
        navigate(orderConfirmationPath(order.id));
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Something went wrong.');
        setIsPlacingOrder(false);
      }
      return;
    }

    try {
      setFormError(undefined);
      setIsPlacingOrder(true);
      const { razorpayOrderId, amount, currency, keyId } = await createRazorpayOrder({
        items: cartItems,
        addressId: selectedAddressId,
        couponCode: appliedCoupon?.code,
      });
      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Dressing Life',
        prefill: { name: `${user.firstName} ${user.lastName}`, email: user.email, contact: user.phone },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const order = await verifyRazorpayPayment(response);
            clearCart();
            navigate(orderConfirmationPath(order.id));
          } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Payment verification failed.');
          } finally {
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
            setFormError('Payment cancelled. Please try again.');
          },
        },
      });
      razorpay.open();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <Container className="section-y">
      <h1 className="mb-10 text-4xl font-semibold sm:text-5xl">Checkout</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg uppercase tracking-wide">Shipping Address</h2>
              <button
                type="button"
                onClick={addressModal.open}
                className="text-xs font-medium uppercase tracking-wide text-brand-red-700 hover:text-brand-red-800"
              >
                + Add New Address
              </button>
            </div>
            {addresses.length === 0 ? (
              <p className="text-sm text-brand-gray-500">Add an address to continue.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddressId(address.id)}
                    className={cn(
                      'flex flex-col gap-1 border p-4 text-left text-sm',
                      selectedAddressId === address.id ? 'border-brand-black' : 'border-brand-gray-200',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault && <span className="text-xs text-brand-red-700">Default</span>}
                    </div>
                    <p className="text-brand-gray-500">
                      {address.line1}
                      {address.line2 ? `, ${address.line2}` : ''}
                    </p>
                    <p className="text-brand-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-brand-gray-500">{address.country}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg uppercase tracking-wide">Payment Method</h2>
            <Select
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value as PaymentOption)}
              options={PAYMENT_OPTIONS}
              className="max-w-sm"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg uppercase tracking-wide">Coupon Code</h2>
            {appliedCoupon ? (
              <div className="flex items-center justify-between border border-brand-gray-200 p-4 text-sm">
                <span>
                  <span className="font-medium">{appliedCoupon.code}</span> applied — you saved{' '}
                  {formatCurrency(appliedCoupon.discount)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(undefined);
                    setCouponCode('');
                  }}
                  className="text-xs font-medium uppercase tracking-wide text-brand-gray-500 hover:text-brand-black"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex max-w-sm gap-3">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  error={couponError}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  isLoading={isApplyingCoupon}
                  onClick={onApplyCoupon}
                  disabled={!couponCode.trim()}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex h-fit flex-col gap-4 border border-brand-gray-200 p-6">
          <h2 className="font-display text-lg uppercase tracking-wide">Order Summary</h2>
          <div className="flex flex-col divide-y divide-brand-gray-200">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-brand-gray-500">
                  {item.name} ({item.color} / {item.size}) × {item.quantity}
                </span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-brand-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(sub)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-brand-red-700">
              <span>Discount ({appliedCoupon?.code})</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-brand-gray-500">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-brand-gray-200 pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          {formError && <p className="text-sm text-brand-red-600">{formError}</p>}
          <Button
            type="button"
            size="lg"
            isLoading={isPlacingOrder}
            disabled={!selectedAddressId}
            onClick={onPlaceOrder}
            className="mt-2 w-full"
          >
            Place Order
          </Button>
        </div>
      </div>

      <Modal isOpen={addressModal.isOpen} onClose={addressModal.close} title="Add New Address">
        <form onSubmit={handleSubmit(onAddAddress)} className="flex flex-col gap-4">
          {addressFormError && <p className="text-sm text-brand-red-600">{addressFormError}</p>}
          <Input label="Label" placeholder="Home" error={errors.label?.message} {...register('label', { required: 'Label is required' })} />
          <Input label="Address Line 1" error={errors.line1?.message} {...register('line1', { required: 'Address line 1 is required' })} />
          <Input label="Address Line 2 (Optional)" {...register('line2')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" error={errors.city?.message} {...register('city', { required: 'City is required' })} />
            <Input label="State" error={errors.state?.message} {...register('state', { required: 'State is required' })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              error={errors.postalCode?.message}
              {...register('postalCode', { required: 'Postal code is required' })}
            />
            <Input label="Country" error={errors.country?.message} {...register('country', { required: 'Country is required' })} />
          </div>
          <Switch
            checked={!!isDefaultAddress}
            onChange={(checked) => setValue('isDefault', checked)}
            label="Set as default address"
          />
          <Button type="submit" isLoading={isAddingAddress} className="mt-2 w-full">
            Save Address
          </Button>
        </form>
      </Modal>
    </Container>
  );
}
