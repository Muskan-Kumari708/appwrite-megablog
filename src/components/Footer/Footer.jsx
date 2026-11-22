import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

const footerLinks = [
  { title: 'Company', links: ['Features', 'Pricing', 'Affiliate Program', 'Press Kit'] },
  { title: 'Support', links: ['Account', 'Help', 'Contact Us', 'Customer Support'] },
  { title: 'Legals', links: ['Terms & Conditions', 'Privacy Policy', 'Licensing'] },
]

function Footer() {
  return (
    <footer className="relative overflow-hidden py-6 sm:py-8 bg-stone-800 border-t-2 border-t-amber-600">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap -m-3 sm:-m-6">
          <div className="w-full p-3 sm:p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="inline-flex items-center">
                <Logo width="auto" />
              </div>
              <p className="text-sm text-stone-400">
                &copy; Copyright 2023. All Rights Reserved by DevUI.
              </p>
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div
              key={section.title}
              className={`w-full p-3 sm:p-6 md:w-1/2 ${index === 2 ? 'lg:w-3/12' : 'lg:w-2/12'}`}
            >
              <h3 className="mb-4 sm:mb-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                {section.title}
              </h3>
              <ul>
                {section.links.map((name) => (
                  <li key={name} className="mb-3 last:mb-0">
                    <Link
                      className="text-sm sm:text-base font-medium text-stone-100 hover:text-amber-400 duration-200"
                      to="/"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
