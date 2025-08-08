import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white">
     
      <Header />

      <section className="py-20 px-4 flex sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <br/>
          CareConnect; Your <br/>
          Health, Our Priority
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          At CareConnect, we simplify your healthcare journey by connecting you
          with trusted doctors and seamless appointment booking. Experience
          personalized support tailored to your needs, no matter where you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-left">
            <Link
              href="/register"
              className="btn-primary px-8 py-3 text-lg"
            >
              Register
            </Link>
            <Link
              href="#services"
              className="btn-primary px-8 py-3 text-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
        <div className="flex-1/2">
          <img
            src="/assets/hero-image.jpg"
            alt="Hero Image"
            className="max-w-full h-96 rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-20 bg-[#C4E1E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-10">
          <div className=" flex-1/2 mb-16">
            <p className="text-xl text-gray-600 mb-4">
              Our Services
            </p>
            <h2 className="text-3xl  font-bold text-gray-900">
            Your Health, Our Priority
            Seamless Care.
            </h2>
          </div>
          <div className="flex-1/2">
          <p className="text-xl text-gray-600">
          At CareConnect, we simplify your healthcare journey by connecting you
with trusted doctors and seamless appointment booking. Experience
personalized support tailored to your needs, no matter where you are.
            </p>
          </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="text-left p-6 ">
              <div className="rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src="/assets/doctor.jpg"
                  alt="Doctor"
                  className="w-84 h-54 "
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Healthcare Access</h3>
              <p className="text-gray-600">Get connected to you desired care provider with assurance of you  better treatment</p>
            </div>

            <div className="text-left p-6 ">
              <div className="rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src="/assets/payment.jpg"
                  alt="Doctor"
                  className="w-84 h-54 "
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Health Payments</h3>
              <p className="text-gray-600">Low-cost, transparent payments via blockchain and mobile money.</p>
            </div>

            <div className="text-left p-6 ">
              <div className="rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src="/assets/chat.jpg"
                  alt="Doctor"
                  className="w-84 h-54 "
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Health communication</h3>
              <p className="text-gray-600">HIPAA-compliant SMS/USSD and app chats with appointment tracking.</p>
            </div>
          </div>
        </div>
      </section>

     
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-center md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
          </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="text-left">
            <div>
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-2">Call us for immediate assistance</p>
              <p className="text-teal-600 font-medium">+1 (555) 123-4567</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-2">Send us your questions anytime</p>
              <p className="text-teal-600 font-medium">info@careconnect.com</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-2">Come see us in person</p>
              <p className="text-teal-600 font-medium">123 Healthcare Ave<br />Medical City, MC 12345</p>
            </div>
          </div>
          <div>
          <img
            src="/assets/hero-image.jpg"
            alt="Contact Us"
            className="max-w-full h-96 rounded-lg shadow-lg"
          /> 
        </div>
        </div>
     
        </div>
      </section>

      <Footer />
    </div>
  );
}
