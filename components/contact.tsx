"use client"; // Client-side code

import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";

import { EXTRA_LINKS } from "@/constants";
import { useSectionInView } from "@/lib/hooks";

import SectionHeading from "./section-heading";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const Contact = () => {
  const { ref } = useSectionInView("Contact");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const sendEmail = () => {
    // Ensure environment variables are loaded
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // Log the environment variables to check if they are loaded correctly
    console.log("EmailJS Service ID:", serviceID);
    console.log("EmailJS Template ID:", templateID);
    console.log("EmailJS Public Key:", publicKey);

    // Verify all required environment variables are present
    if (!serviceID || !templateID || !publicKey) {
      toast.error("Missing EmailJS configuration. Please check environment variables.");
      setLoading(false);
      return;
    }

    emailjs
      .send(
        serviceID,
        templateID,
        {
          to_name: form.name,
          to_email: form.email,
          message: form.message,
        },
        publicKey
      )
      .then(
        () => {
          toast.success("Thank You. I will get back to you as soon as possible.");
        },
        (error: EmailJSResponseStatus) => {
          console.error("EmailJS Error:", error);
          toast.error(error.text ?? "Something went wrong with EmailJS!");
        }
      )
      .finally(() => {
        setLoading(false);
        setForm({ name: "", email: "", message: "" });
      });
  };

  const validateForm = (): boolean => {
    const { name, email, message } = form;

    if (name.trim().length < 3) {
      toast.error("Invalid Name");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim().toLowerCase().match(emailRegex)) {
      toast.error("Invalid E-mail");
      return false;
    }

    if (message.trim().length < 5) {
      toast.error("Invalid Message");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    sendEmail(); // Call the email function
  };

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 text-center w-[min(100%,38rem)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <SectionHeading>Contact Me</SectionHeading>

      <p className="text-gray-700 -mt-6 dark:text-white/80">
        Please contact me directly at my{" "}
        <Link className="underline" href={`mailto:${EXTRA_LINKS.email}`}>
          e-mail
        </Link>{" "}
        or through this form.
      </p>

      <form
        className="mt-10 flex flex-col dark:text-black"
        autoComplete="off"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="h-14 rounded-lg px-4 borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100"
          required
          maxLength={200}
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your email"
          className="h-14 rounded-lg my-4 px-4 borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100"
          required
          maxLength={100}
        />

        <textarea
          className="h-52 rounded-lg mb-4 borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message"
          required
          maxLength={500}
        />

        <button
          type="submit"
          className="group flex items-center justify-center gap-2 h-[3rem] w-[8rem] bg-gray-900 text-white rounded-full"
          disabled={loading}
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin border-b-2 border-white" />
          ) : (
            <>
              Submit <FaPaperPlane className="text-xs group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </motion.section>
  );
};

export default Contact;
