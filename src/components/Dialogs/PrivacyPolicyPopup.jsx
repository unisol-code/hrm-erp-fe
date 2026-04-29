import React from 'react'
import { X } from 'lucide-react';

const PrivacyPolicyPopup = () => {
    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-4 rounded-lg max-h-[90vh] overflow-y-auto w-[90%] max-w-[800px] rounded-[15px] scrollbar-hide'>
                <div className="flex items-center">
                    <div className='text-center text-3xl font-semibold montserrat flex-1'>Privacy Policy</div>
                    <div className='flex-0'><X className='h-6 w-6 cursor-pointer text-[#00000066]' /></div>
                </div>
                <div className='px-3 py-4 inter text-[#444444] text-base font-normal leading-5 tracking-[0.01em]'>
                    At [Your Business/Service Name], we are committed to safeguarding your privacy and ensuring that your personal information is protected. This Privacy Policy outlines how we collect, use, share, and protect the data you provide when accessing or using our platform, including our website, mobile application, and related services. By using our platform, you consent to the practices described in this policy. If you do not agree to any part of this Privacy Policy, please refrain from using our services.
                    We collect personal information to provide you with seamless access to our services, improve our offerings, and comply with legal and regulatory obligations. The types of data we may collect include your name, contact details (such as email address and phone number), identification documents, bank account information, transaction details, and other relevant financial data required for loan applications or other services. Additionally, we may collect non-personal information, such as your device details, IP address, and browsing behavior, to enhance the functionality and security of our platform.
                    Your personal information is primarily collected when you voluntarily provide it to us, such as during registration, loan applications, customer support interactions, or participation in surveys and promotions. In some cases, we may collect information automatically through cookies, tracking tools, or third-party analytics services to monitor platform usage and optimize your user experience.
                    The information you provide is used to process loan applications, verify your identity, assess creditworthiness, and facilitate transactions. Additionally, we use your data to improve our services, provide personalized recommendations, and communicate important updates, such as changes to our terms or features. Your data may also be used for legal compliance, fraud detection, and resolving disputes.
                    We are committed to ensuring the confidentiality of your data and do not sell or share your personal information with unauthorized third parties. However, in order to provide our services, we may share your information with trusted partners, such as financial institutions, payment processors, and credit bureaus. These third parties are bound by strict confidentiality agreements and are only permitted to use your information for the purposes outlined in this policy.
                    In certain cases, we may disclose your information to comply with legal obligations, court orders, or requests from government authorities. Additionally, your information may be shared in connection with business transactions, such as mergers, acquisitions, or asset sales, provided that the receiving party agrees to protect your information in accordance with this Privacy Policy.
                    We employ robust security measures to protect your personal information from unauthorized access, loss, or misuse. These measures include encryption, secure servers, firewalls, and access controls. While we strive to ensure the security of your data, no online platform can guarantee absolute security. Therefore, we encourage you to use strong passwords, avoid sharing your credentials, and report any suspicious activity immediately.
                    Our platform may include links to third-party websites or services for your convenience. However, we are not responsible for the privacy practices or content of these external platforms. We encourage you to review their privacy policies before providing any personal information.
                    You have the right to access, update, or delete your personal information at any time, subject to legal and regulatory requirements. If you wish to exercise these rights, please contact us at [Support Email/Phone Number]. Additionally, you may opt out of receiving marketing communications by following the unsubscribe instructions provided in our emails or contacting our support team.
                    We reserve the right to update this Privacy Policy periodically to reflect changes in our practices, legal requirements, or business operations. Any updates will be posted on this page, and your continued use of our platform constitutes acceptance of the revised policy. We encourage you to review this Privacy Policy regularly to stay informed about how we handle your data.
                    If you have any questions, concerns, or complaints regarding this Privacy Policy or our data practices, you can contact us at:Email: [Your Support Email]Phone: [Your Support Number]Address: [Your Office Address]
                    By using our platform, you acknowledge that you have read, understood, and agreed to this Privacy Policy in its entirety. Your trust is important to us, and we are dedicated to protecting your privacy and ensuring transparency in our data practices.
                </div>
                <div className='flex items-center justify-center gap-3'>
                    <input type="checkbox" name="" id="" />
                    <span className='text-[#000000] inter font-normal text-base leading-5 tracking-[0.01em]'>I have read and understood the Privacy Policy</span>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicyPopup