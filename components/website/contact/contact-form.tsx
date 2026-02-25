'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Phone, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { contactSchema, TContactSchemaForm } from '@/validations/contact.schema';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { TextInput } from '@/components/shared/input/TextInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { LoadingButton } from '@/components/shared/buttons/loading-button';

function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactSchema()),
  });

  const onSubmit = async (data: TContactSchemaForm) => {
    try {
      // await submitContact(data);
      toast.success('Message sent successfully');
    } catch (error) {
      const errMsg = (error as Error)?.message || 'Failed to send message';
      toast.error(errMsg);
      console.error('Error submit contact:', error);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/10 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold md:text-2xl">Send a Message</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter your name"
              autoFocus
            />
            <TextInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="email@example.com"
              type="email"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextInput
              control={form.control}
              name="subject"
              label="Subject"
              placeholder="Enter your subject"
            />
            <NumericInput
              control={form.control}
              name="phone"
              label="Phone"
              placeholder="01234567890"
              icon={<Phone className="text-muted-foreground h-5 w-5" />}
              isPhoneNumber
            />
          </div>

          <TextAreaInput
            control={form.control}
            name="msg"
            label="Message"
            placeholder="Enter your message"
          />

          <LoadingButton
            isLoading={false}
            loadingText="Sending..."
            defaultText="Send Message"
            icon={Send}
            className="w-full rounded-full"
          />
        </form>
      </Form>
    </div>
  );
}

export default ContactForm;
