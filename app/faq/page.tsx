'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is GreenChainz?',
    answer: '[PLACEHOLDER: GreenChainz is a sustainable supplier directory that connects businesses with verified eco-friendly suppliers to promote green sourcing practices.]'
  },
  {
    question: 'How do I register as a supplier?',
    answer: '[PLACEHOLDER: You can register as a supplier by clicking on "Register as Supplier" in our navigation menu. You’ll need to provide company information, certifications, and sustainability metrics for verification.]'
  },
  {
    question: 'What certifications do you verify?',
    answer: '[PLACEHOLDER: We verify various sustainability certifications including ISO 14001, FSC, USDA Organic, Energy Star, GOTS, and more. Each supplier undergoes our comprehensive vetting process.]'
  },
  {
    question: 'How is the sustainability score calculated?',
    answer: '[PLACEHOLDER: The sustainability score is calculated based on multiple factors including certifications, carbon footprint data, sustainable practices, third-party audits, and customer feedback.]'
  },
  {
    question: 'Is there a cost to use GreenChainz?',
    answer: '[PLACEHOLDER: Basic search functionality is free. Premium features for businesses and supplier verification services may have associated fees. Contact us for pricing details.]'
  },
  {
    question: 'How do I contact a supplier?',
    answer: '[PLACEHOLDER: Once logged in, you can view supplier details and use our secure messaging system to contact them directly. You can also find their public contact information on their profile.]'
  },
  {
    question: 'How often is supplier information updated?',
    answer: '[PLACEHOLDER: Supplier profiles are updated regularly. Suppliers can update their information at any time, and we conduct periodic reviews to ensure data accuracy.]'
  },
  {
    question: 'Can I request a specific type of supplier?',
    answer: '[PLACEHOLDER: Yes! Use our advanced search filters to find suppliers by category, location, certification, and sustainability score. You can also contact us for personalized sourcing assistance.]'
  }
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-800 pr-4">{item.question}</span>
        <span className={`text-2xl text-green-600 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 pb-4 text-gray-600 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GreenChainz" className="h-12 w-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
        </div>

        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-8 transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-gray-700 text-lg leading-relaxed">
            Find answers to common questions about GreenChainz, our sustainable supplier directory, 
            and how we can help your business go green.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
            />
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="mb-6 text-green-100">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
