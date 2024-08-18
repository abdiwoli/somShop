import React from 'react';
import './PrivacyPolicy.css'; // Optional: Custom styles for the component

const PrivacyPolicy = () => {
  return (
    <section className="privacy-policy-section">
      <div className="container">
        <h2 className="privacy-policy-title">Privacy and Policy</h2>
        
        <p className="policy-description">
          At <strong>SOM</strong>, we are committed to protecting your privacy and ensuring the security of your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
        </p>

        <h3 className="policy-subtitle">1. Information We Collect</h3>
        <p className="policy-text">
          We collect information that you provide directly to us, such as when you create an account, place an order, or contact our customer support.
          This may include your name, email address, shipping address, payment information, and other details necessary to fulfill your order and provide support.
        </p>
        <p className="policy-text">
          We may also collect information automatically when you use our website, including your IP address, browsing behavior, and device information.
          This data helps us improve our website and offer a better shopping experience.
        </p>

        <h3 className="policy-subtitle">2. How We Use Your Information</h3>
        <p className="policy-text">
          We use the information we collect to process your orders, manage your account, and provide customer support. Additionally, we may use your information
          to send you promotional materials, updates, and offers if you have opted in to receive them. You can unsubscribe from these communications at any time.
        </p>

        <h3 className="policy-subtitle">3. Sharing Your Information</h3>
        <p className="policy-text">
          We do not sell or rent your personal information to third parties. However, we may share your information with trusted partners who assist us in operating
          our website, conducting business, or serving you, as long as they agree to keep this information confidential. We may also share your information if required by law.
        </p>

        <h3 className="policy-subtitle">4. Security of Your Information</h3>
        <p className="policy-text">
          We implement a variety of security measures to protect your personal information. This includes using encryption technologies and securing our databases against unauthorized access.
          However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

        <h3 className="policy-subtitle">5. Your Rights and Choices</h3>
        <p className="policy-text">
          You have the right to access, update, or delete your personal information at any time by logging into your account or contacting us directly. You can also choose not to receive promotional communications by following the unsubscribe instructions in any email we send you.
        </p>

        <h3 className="policy-subtitle">6. Changes to This Policy</h3>
        <p className="policy-text">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the date at the top of the policy will be updated accordingly. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
        </p>

        <h3 className="policy-subtitle">7. Contact Us</h3>
        <p className="policy-text">
          If you have any questions about this Privacy Policy or our practices, please contact us at <a href="mailto:abdiwolih@gmail.com">abdiwolih@gmail.com</a> or via WhatsApp at <a href="https://wa.me/97455675949" target="_blank" rel="noopener noreferrer">+974 5567 5949</a>.
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
