// client/src/pages/Terms.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="terms-page">
      
      
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h1 className="display-5 fw-bold mb-4 text-center">Terms and Conditions</h1>
                <p className="text-muted text-center mb-5">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <div className="terms-content">
                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">1. Introduction</h2>
                    <p>
                      Welcome to Ezee Trip! These Terms and Conditions govern your use of our website, services, and booking platform. 
                      By accessing or using Ezee Trip, you agree to be bound by these terms. If you disagree with any part of the terms, 
                      you may not access our services.
                    </p>
                    <p>
                      Ezee Trip is a travel management platform operated by Ezee Trip Technologies Pvt. Ltd., providing travel 
                      booking services for destinations including but not limited to Chikkamagaluru, Karnataka.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">2. User Accounts</h2>
                    <h3 className="h5 fw-bold mb-2">2.1 Registration</h3>
                    <p>
                      To use certain features of our service, you must register for an account. You agree to provide accurate, current, 
                      and complete information during the registration process and to keep such information updated.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">2.2 Account Security</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                      responsibility for all activities that occur under your account or password. Ezee Trip cannot and will not be 
                      liable for any loss or damage arising from your failure to comply with this security obligation.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">2.3 Account Termination</h3>
                    <p>
                      Ezee Trip reserves the right to terminate or suspend your account immediately, without prior notice or liability, 
                      for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">3. Bookings and Payments</h2>
                    <h3 className="h5 fw-bold mb-2">3.1 Booking Process</h3>
                    <p>
                      All bookings are subject to availability and confirmation. Your booking is not confirmed until you receive 
                      a confirmation email from Ezee Trip. We reserve the right to modify or cancel bookings due to unforeseen 
                      circumstances, including but not limited to weather conditions, natural disasters, or government restrictions.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">3.2 Payment Terms</h3>
                    <p>
                      Payment for bookings must be made in advance as specified during the booking process. We accept various 
                      payment methods as indicated on our website. All payments are subject to verification and approval.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">3.3 Pricing</h3>
                    <p>
                      All prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. 
                      Prices are subject to change without notice, but changes will not affect bookings that have already been confirmed.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">3.4 Cancellation and Refunds</h3>
                    <p>
                      Cancellation policies vary depending on the type of booking and service provider. Generally:
                    </p>
                    <ul>
                      <li>Cancellations made 48 hours or more before the travel date may be eligible for a full refund</li>
                      <li>Cancellations made between 24-48 hours before travel may be eligible for a 50% refund</li>
                      <li>Cancellations made less than 24 hours before travel are non-refundable</li>
                    </ul>
                    <p>
                      Refund processing may take 7-10 business days to reflect in your account.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">4. User Responsibilities</h2>
                    <h3 className="h5 fw-bold mb-2">4.1 Conduct</h3>
                    <p>
                      You agree not to use the service for any unlawful purpose or in any way that could damage, disable, 
                      overburden, or impair the service. You must not attempt to gain unauthorized access to any part of the service.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">4.2 Accuracy of Information</h3>
                    <p>
                      You are responsible for ensuring the accuracy of all information provided during the booking process. 
                      Ezee Trip is not responsible for any issues arising from incorrect information provided by users.
                    </p>
                    
                    <h3 className="h5 fw-bold mb-2">4.3 Travel Documents</h3>
                    <p>
                      You are responsible for ensuring you have all necessary travel documents, including valid identification
                       and any other required documents for your destination.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">5. Intellectual Property</h2>
                    <p>
                      All content on the Ezee Trip website, including but not limited to text, graphics, logos, images, 
                      and software, is the property of Ezee Trip or its content suppliers and is protected by international 
                      copyright laws.
                    </p>
                    <p>
                      You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, 
                      repurpose, or otherwise use any of the content on our service without prior written permission from Ezee Trip.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">6. Limitation of Liability</h2>
                    <p>
                      In no event shall Ezee Trip, its directors, employees, partners, agents, suppliers, or affiliates, 
                      be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                      limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                    <p>
                      Our total liability for any claims arising from these Terms or your use of the service shall not exceed 
                      the amount you paid for the specific service giving rise to the claim.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">7. Force Majeure</h2>
                    <p>
                      Ezee Trip shall not be liable for any failure or delay in performance under these Terms resulting 
                      from circumstances beyond its reasonable control, including but not limited to acts of God, war, 
                      terrorism, riots, embargoes, acts of civil or military authority, fire, floods, accidents, strikes, 
                      or shortages of transportation facilities, fuel, energy, labor or materials.
                    </p>
                  </section>

                  

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">9. Indemnification</h2>
                    <p>
                      You agree to indemnify and hold Ezee Trip and its parent, subsidiaries, affiliates, partners, officers, 
                      directors, and employees harmless from any claim or demand, including reasonable attorneys' fees, 
                      made by any third party due to or arising out of your breach of these Terms or your violation of 
                      any law or the rights of a third party.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">10. Changes to Terms</h2>
                    <p>
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision 
                      is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. 
                      What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p>
                      By continuing to access or use our service after those revisions become effective, you agree to be bound 
                      by the revised terms. If you do not agree to the new terms, please stop using the service.
                    </p>
                  </section>

                  <section className="mb-5">
                    <h2 className="h3 fw-bold mb-3">11. Contact Information</h2>
                    <p>
                      Questions about the Terms should be sent to us at <a href="mailto:ibbtours.ckm@gmail.com" className="text-primary">ibbtours.ckm@gmail.com</a>.
                    </p>
                    <div className="mt-4">
                      <h4 className="h5 fw-bold">Ezee Trip Technologies Pvt. Ltd.</h4>
                      <p className="mb-1">Coffee Estate Road, Chikkamagaluru</p>
                      <p className="mb-1">Karnataka 577101, India</p>
                      <p className="mb-1">Email: ibbtours.ckm@gmail.com</p>
                      <p className="mb-1">Phone: +91 9844311540</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <style jsx>{`
        .terms-page {
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .terms-content {
          line-height: 1.8;
        }
        
        .terms-content h2 {
          color: #0d6efd;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .terms-content h3 {
          color: #495057;
          margin-top: 20px;
        }
        
        .terms-content ul {
          padding-left: 20px;
        }
        
        .terms-content li {
          margin-bottom: 8px;
        }
        
        .terms-content a {
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .terms-content a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .terms-content {
            font-size: 14px;
          }
          
          .terms-content h2 {
            font-size: 1.5rem;
          }
          
          .terms-content h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Terms;