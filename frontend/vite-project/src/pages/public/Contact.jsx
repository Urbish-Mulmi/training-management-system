import React from 'react'
import ContactForm from '../../components/contact/ContactForm'
import ContactInfo from '../../components/contact/ContactInfo'
import ContactMap from '../../components/contact/ContactMap'

const Contact = () => {
  return (
    <div>
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </div>
  )
}

export default Contact
