import ContactForm from "./ContactForm";

import { title } from "@/components/primitives";
import { Container } from "@/components/layouts/Container";
import { getDictionary } from "@/app/dictionaries";

export default async function ContactPage() {
  const dict = await getDictionary("ko");
  return (
    <Container className="py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={title({ size: "sm" })}>{dict.contact.page.title}</h1>
          <p className="text-sm text-default-500 mt-2">
            {dict.contact.page.subtitle}
          </p>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
