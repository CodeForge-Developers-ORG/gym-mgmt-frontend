"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Check, ChevronRight, ChevronLeft, CalendarIcon } from "lucide-react";
import { useForm, FormProvider as Form } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useMeasure from "react-use-measure";

const TEAM_SIZE_OPTIONS = [
  { label: "1-5 Members", value: "1-5" },
  { label: "5-10 Members", value: "5-10" },
  { label: "10+ Members", value: "10+" },
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
  { label: "Critical", value: "Critical" },
];

const formSchema = z.object({
  "project-name": z.string().min(1, "Project name is required"),
  "due-date": z.date({ message: "A due date is required" }),
  description: z.string().optional(),
  "team-size": z.string().min(1, "Please select a team size"),
  priority: z.string().min(1, "Please select a priority"),
  tag: z.array(z.string()).optional(),
  mood: z.string().optional(),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MultiStepFormDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<number>();
  const [ref, bounds] = useMeasure();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "project-name": "",
      "due-date": undefined,
      description: "",
      "team-size": undefined,
      priority: undefined,
      tag: [],
      mood: "",
      comment: "",
    },
  });

  function onSubmit(values: FormValues) {
    try {
      console.log(values);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (currentStep === 0) fieldsToValidate = ["project-name", "due-date"];
    if (currentStep === 1) fieldsToValidate = ["team-size", "priority"];

    const isStepValid = await form.trigger(fieldsToValidate);
    
    if (isStepValid) {
      if (currentStep === 2) {
        form.handleSubmit(onSubmit)();
        return;
      }
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const stepTitles = [
    { title: "Create New Project", description: "Start by providing the essential details for your workspace." },
    { title: "Configuration", description: "Define team access and project priority settings." },
    { title: "Project Kickoff Mood", description: "How confident do you feel about this new project?" },
  ];

  const watchedValues = form.watch();

  const content = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 py-4 px-1">
            <Field>
              <FieldLabel htmlFor="project-name">Project Name</FieldLabel>
              <Input id="project-name" placeholder="e.g Website Design" {...form.register("project-name")} />
              <FieldError>{form.formState.errors["project-name"]?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watchedValues["due-date"] && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedValues["due-date"] ? format(watchedValues["due-date"] as Date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchedValues["due-date"]}
                    onSelect={(date) => form.setValue("due-date", date as Date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FieldError>{form.formState.errors["due-date"]?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" placeholder="Describe the project goals and scope..." className="min-h-[100px]" {...form.register("description")} />
              <FieldError>{form.formState.errors.description?.message}</FieldError>
            </Field>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 py-4 px-1">
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="team-size">Team Size</FieldLabel>
                <Select value={watchedValues["team-size"]} onValueChange={(val) => form.setValue("team-size", val)}>
                  <SelectTrigger id="team-size" className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.label} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{form.formState.errors["team-size"]?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="priority">Priority</FieldLabel>
                <Select value={watchedValues["priority"]} onValueChange={(val) => form.setValue("priority", val)}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.label} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{form.formState.errors.priority?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="tag">Tags</FieldLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {watchedValues["tag"]?.map((t, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {t}
                      <button
                        type="button"
                        onClick={() => {
                          const tags = form.getValues("tag") || [];
                          form.setValue("tag", tags.filter((_, index) => index !== i));
                        }}
                        className="hover:text-destructive text-xs ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tag"
                  placeholder="e.g. Design, Marketing"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        const tags = form.getValues("tag") || [];
                        if (!tags.includes(val)) {
                          form.setValue("tag", [...tags, val]);
                        }
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
              <FieldError>{form.formState.errors.tag?.message}</FieldError>
            </Field>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 py-4 px-1">
            <div className="rounded-xl border bg-background overflow-hidden relative">
              <div className="flex w-full border-b divide-x bg-muted/5">
                {[
                  { emoji: "😰", value: "anxious", label: "Anxious" },
                  { emoji: "😟", value: "worried", label: "Worried" },
                  { emoji: "😐", value: "neutral", label: "Neutral" },
                  { emoji: "🙂", value: "good", label: "Good" },
                  { emoji: "🤩", value: "excited", label: "Excited" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={cn(
                      "flex-1 p-3 md:p-4 text-2xl md:text-3xl transition-all hover:bg-muted focus:outline-none",
                      watchedValues["mood"] === option.value ? "bg-primary/10 grayscale-0 scale-110" : "grayscale-[1] hover:grayscale-0"
                    )}
                    type="button"
                    title={option.label}
                    onClick={() => form.setValue("mood", option.value)}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
              <Textarea
                id="comment"
                placeholder="Add a comment..."
                className="min-h-[140px] resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 placeholder:text-muted-foreground/60"
                {...form.register("comment")}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Your feedback helps us understand the project kickoff vibe.
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [currentStep, form, watchedValues]);

  const variants = {
    initial: (direction: number) => ({ x: `${110 * direction}%`, opacity: 0 }),
    animate: { x: "0%", opacity: 1 },
    exit: (direction: number) => ({ x: `${-110 * direction}%`, opacity: 0 }),
  };

  return (
    <Form {...form}>
      <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
        <div className="flex w-full items-center justify-center p-4">
          <Card className="w-full max-w-xl shadow-md border overflow-hidden bg-background">
            <motion.div layout>
              <CardHeader className="flex flex-col items-start justify-between space-y-4 px-6 py-6 border-b border-border/50">
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-xl">{stepTitles[currentStep].title}</CardTitle>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      Step {currentStep + 1} of {stepTitles.length}
                    </span>
                  </div>
                  <CardDescription>{stepTitles[currentStep].description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full pt-2">
                  {stepTitles.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-2 rounded-full transition-all duration-500 ease-in-out",
                        currentStep === index ? "w-1/2 bg-primary" : currentStep > index ? "w-1/4 bg-primary/60" : "w-1/4 bg-muted"
                      )}
                    />
                  ))}
                </div>
              </CardHeader>

              <motion.div
                animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}
                className="relative overflow-hidden"
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              >
                <div ref={ref}>
                  <CardContent className="px-6 py-2 relative">
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                      <motion.div
                        key={currentStep}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full"
                        custom={direction}
                      >
                        {content}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </div>
              </motion.div>

              <CardFooter className="flex justify-between items-center border-t border-border/50 bg-muted/10 py-4 px-6">
                <Button variant="outline" type="button" onClick={prevStep} disabled={currentStep === 0}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button type="button" onClick={nextStep} className={currentStep === stepTitles.length - 1 ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                  {currentStep === stepTitles.length - 1 ? (
                    <>
                      Complete Setup <Check className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </motion.div>
          </Card>
        </div>
      </MotionConfig>
    </Form>
  );
}
