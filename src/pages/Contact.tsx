
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      form.reset();
      
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
    }, 1000);
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              I'm always eager to learn and collaborate on new projects.
              Feel free to reach out to me 🙂
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What is this about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href="mailto:noel.regis04@gmail.com" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        noel.regis04@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a 
                        href="tel:+917319546900" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +91 7319546900
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Location</p>
                      <a 
                        href="https://www.google.com/maps/place/Asansol,+West+Bengal,+India"
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Asansol, West Bengal, India
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Connect</h2>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.linkedin.com/in/noel-regis-aa07081b1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-secondary p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-primary" />
                    <span>LinkedIn</span>
                  </a>
                  
                  <a
                    href="https://github.com/noelregis18"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-secondary p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Github className="h-5 w-5 text-primary" />
                    <span>GitHub</span>
                  </a>
                  
                  <a
                    href="https://x.com/NoelRegis8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-secondary p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Twitter className="h-5 w-5 text-primary" />
                    <span>Twitter</span>
                  </a>
                  
                  <a
                    href="http://topmate.io/noel_regis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-secondary p-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <span className="h-5 w-5 flex items-center justify-center text-primary font-bold">TM</span>
                    <span>Topmate</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-blue rounded-xl p-6 text-white">
                <h3 className="font-semibold text-xl mb-3">Let's Work Together</h3>
                <p className="text-blue-100">
                  Have a project in mind or need financial planning assistance? 
                  I'd be happy to discuss how I can help you achieve your goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
