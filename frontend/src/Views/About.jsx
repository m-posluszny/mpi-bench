import { Title } from '../Static/Title.component';
import { Footer } from '../Static/Footer.component';

const gap = "m-2"
const subtitle = "m-2 my-3 text-xl font-bold"

export const AboutView = () => (
  <>
    <main className="flex my-auto flex-col  overflow-y-visible overflow-x-hidden h-[100vh]">
      <Title />
      <div className="  rounded-2xl mt-10 mx-auto w-2/5" style={{ "minWidth": "400pt" }}>
        <div className="bg-opacity-20 bg-white rounded-2xl p-3 text-xl mb-3 text-white width-min" >
          <h1 className="m-2 my-4 text-3xl font-bold">About</h1>
          <h3 className={subtitle}>
            Our Purpose
          </h3>
          <p className={gap}>
            Trust Pass is an open-source tool designed to assess password strength. Our goal is to empower users by providing insights into the security of their passwords.
          </p>
          <h3 className={subtitle}>
            What We Offer
          </h3>
          <p className={gap}>
            Trust Pass uses industry standards and an AI model trained on password popularity to analyze passwords. We evaluate factors like length, complexity, and vulnerability to common attacks.
          </p>
          <h3 className={subtitle}>
            How It Works
          </h3>
          <p className={gap}>
            Submit your password, and our AI algorithms instantly evaluate its strength. We never store passwords, ensuring your security and privacy.
          </p>
          <h3 className={subtitle}>
            Why Choose Trust Pass
          </h3>
          <p className={gap}>
            Code Transparency: Trust Pass is open-source, allowing scrutiny for security and trust.
            Accuracy: Our AI stays updated with security trends for reliable assessments.
            User-friendly: Trust Pass is accessible and easy to use.
          </p>
          <h3 className={subtitle}>
            Utilizing Our REST API
          </h3>
          <p className={gap}>
            Trust Pass offers a REST API for direct integration into your solutions. Access our powerful password evaluation capabilities programmatically.
          </p>
          <h3 className={subtitle}>
            Our Commitment
          </h3>
          <p className={gap}>
            We're dedicated to continuous improvement, adapting to emerging threats, and refining our AI for enhanced evaluations.
          </p>
          <h3 className={subtitle}>
            Get Started with Trust Pass
          </h3>
          <p className={gap}>
            Leverage Trust Pass's Password Assessment Tool or integrate our REST API directly to gauge password security and make informed decisions about your online safety.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>
)