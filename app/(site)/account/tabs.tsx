'use client';
import { useState } from 'react';
import {
  CubeIcon as PackageIcon,
  MapPinIcon as LocationIcon,
  ArrowRightStartOnRectangleIcon as LogoutIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  PencilIcon as EditIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Tab Components
const  OrdersTab = ({ orders, isLoading, error, fetchOrders }: any) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-2 md:py-16">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-base md:text-lg">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 md:py-16 px-4">
        <div className="text-red-600 mb-6">
          <p className="text-base md:text-lg">Error loading orders: {error}</p>
        </div>
        <button
          onClick={() => fetchOrders()}
          className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-200 text-sm md:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 ml-4">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-16 text-center">
          <p className="text-gray-500 mb-6 text-base md:text-lg">No orders found.</p>
          <a href="/search" className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-200 text-sm md:text-base">
            Start shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl md:rounded-2xl overflow-hidden">
                {/* Collapsible Header */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full px-4 md:px-8 py-4 md:py-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Mobile Layout */}
                  <div className="block md:hidden">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-left flex-1 min-w-0 mr-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">Order {order.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(order.processedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="transition-transform duration-200">
                          {isExpanded ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          order.fulfillmentStatus?.toLowerCase() === 'fulfilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.fulfillmentStatus?.toLowerCase() || 'pending'}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          order.financialStatus?.toLowerCase() === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.financialStatus?.toLowerCase() || 'pending'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">
                          {order.totalPrice.currencyCode} {order.totalPrice.amount}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {order.lineItems.length} item{order.lineItems.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <h3 className="text-xl font-medium text-gray-900">Order {order.name}</h3>
                        <p className="text-gray-500 mt-1">
                          Placed on {new Date(order.processedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          order.fulfillmentStatus?.toLowerCase() === 'fulfilled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.fulfillmentStatus?.toLowerCase() || 'pending'}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          order.financialStatus?.toLowerCase() === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.financialStatus?.toLowerCase() || 'pending'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-medium text-gray-900">
                          {order.totalPrice.currencyCode} {order.totalPrice.amount}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {order.lineItems.length} item{order.lineItems.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="transition-transform duration-200">
                        {isExpanded ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 md:px-8 pb-6 md:pb-8">
                    <div className="pt-4 md:pt-6">
                      <h4 className="font-medium mb-4 text-gray-900 text-base md:text-lg">Items ({order.lineItems.length})</h4>
                      <div className="space-y-4">
                        {order.lineItems.map((item: any, index: number) => (
                          <div key={index} className="flex items-start md:items-center space-x-3 md:space-x-4">
                            {item.variant.image && (
                              <img
                                src={item.variant.image.url}
                                alt={item.variant.image.altText || item.title}
                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 text-sm md:text-base leading-tight">{item.title}</h5>
                              <p className="text-gray-500 text-xs md:text-sm mt-1">{item.variant.title}</p>
                              <p className="text-gray-500 text-xs md:text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {item.variant.price.currencyCode} {item.variant.price.amount}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 md:pt-6 mt-4 md:mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {order.shippingAddress && (
                          <div>
                            <h5 className="font-medium mb-3 text-gray-900 text-sm md:text-base">Shipping Address</h5>
                            <div className="text-gray-600 space-y-1 text-xs md:text-sm">
                              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                              <p>{order.shippingAddress.address1}</p>
                              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                              <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        )}
                        <div>
                          <h5 className="font-medium mb-3 text-gray-900 text-sm md:text-base">Order Summary</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-gray-600 text-xs md:text-sm">
                              <span>Subtotal:</span>
                              <span>{order.subtotalPrice.currencyCode} {order.subtotalPrice.amount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-xs md:text-sm">
                              <span>Tax:</span>
                              <span>{order.totalTax.currencyCode} {order.totalTax.amount}</span>
                            </div>
                            <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-100 text-sm md:text-base">
                              <span>Total:</span>
                              <span>{order.totalPrice.currencyCode} {order.totalPrice.amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProfileTab = ({ customer, updateProfile }: any) => {
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    phone: customer?.phone || '',
    acceptsMarketing: customer?.acceptsMarketing || false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0 max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 ml-4">Profile Settings</h2>
      {message && (
        <div className={`mb-8 p-4 rounded-xl border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={customer?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-3">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-3">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptsMarketing"
              name="acceptsMarketing"
              checked={formData.acceptsMarketing}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="acceptsMarketing" className="ml-3 block text-sm text-gray-700">
              I would like to receive marketing emails
            </label>
          </div>
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressTab = ({ customer }: any) => {
  const [addresses, setAddresses] = useState([
    // Sample addresses - replace with actual data from your backend
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      company: '',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      province: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 555-0123',
      isDefault: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'United States',
    phone: '',
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      zip: '',
      country: 'United States',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setFormData(address);
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      // Implement delete logic here
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      setMessage({ type: 'success', text: 'Address deleted successfully!' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (editingAddress) {
        // Update existing address
        setAddresses(prev => prev.map(addr =>
          addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } : addr
        ));
        setMessage({ type: 'success', text: 'Address updated successfully!' });
      } else {
        // Add new address
        const newAddress = { ...formData, id: Date.now().toString() };
        setAddresses(prev => [...prev, newAddress]);
        setMessage({ type: 'success', text: 'Address added successfully!' });
      }
      resetForm();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save address'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0 ml-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 ml-4">Address Book</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Address
        </button>
      </div>
      {message && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      {/* Address Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-900">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-3">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-3">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-3">
                Company (Optional)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-3">
                Address Line 1 *
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-3">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-3">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-3">
                  State/Province *
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-3">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-3">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="isDefault" className="ml-3 block text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className=" flex flex-col md:flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
            <LocationIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-6 text-lg">No addresses saved yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {address.firstName} {address.lastName}
                    </h3>
                    {address.isDefault && (
                      <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-gray-600 space-y-1">
                    {address.company && <p>{address.company}</p>}
                    <p>{address.address1}</p>
                    {address.address2 && <p>{address.address2}</p>}
                    <p>{address.city}, {address.province} {address.zip}</p>
                    <p>{address.country}</p>
                    {address.phone && <p>{address.phone}</p>}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    title="Edit address"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete address"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export {AddressTab, OrdersTab, ProfileTab}
