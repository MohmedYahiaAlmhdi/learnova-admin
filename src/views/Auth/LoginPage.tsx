'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, GraduationCap, ArrowRight, AlertCircle, Loader2, ShieldCheck, Sparkles, BookOpen, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { useAuthStore, useNavigationStore } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

/* ── Zod Schema ── */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* ── Animation Variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingOrbVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/* ── Component ── */
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();

  const { login, isLoading, error, clearError } = useAuthStore();
  const { navigate } = useNavigationStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearError();
    try {
      await login(values.email, values.password);
      navigate('dashboard');
    } catch {
      // Error is already set in the store
    }
  };

  const handleForgotPassword = () => {
    navigate('auth');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left Decorative Panel ── */}
      <motion.div
        className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative overflow-hidden"
        variants={leftPanelVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/15" />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Radial Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Top: Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 overflow-hidden">
              <Image src="/learnova-logo.jpg" alt="Learnova" width={44} height={44} className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
                Learnova
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Center: Feature Highlights */}
          <div className="flex flex-col gap-7">
            {/* Floating decorative orb */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#4F46E5]/10"
              variants={floatingOrbVariants}
              animate="animate"
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#06B6D4]/8"
              variants={{
                animate: {
                  y: [0, 10, 0],
                  transition: {
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  },
                },
              }}
              animate="animate"
            />

            <motion.div
              className="relative z-10"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center mb-5">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl xl:text-3xl font-display font-bold text-foreground leading-tight mb-3">
                Enterprise-grade{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  security
                </span>{' '}
                & control
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[320px]">
                Manage your entire learning ecosystem from a single, powerful
                dashboard built for modern teams.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col gap-5 relative z-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.5 },
                },
              }}
            >
              {[
                {
                  icon: BookOpen,
                  title: 'Course Management',
                  desc: 'Create, review & publish courses',
                },
                {
                  icon: Sparkles,
                  title: 'Smart Analytics',
                  desc: 'Real-time insights & reports',
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3.5 group"
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-card/80 border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                    <feature.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {feature.title}
                    </p>
                    <p className="text-xs text-muted-foreground/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom: Trusted By */}
          <div className="relative z-10">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
            <p className="text-xs text-muted-foreground/60">
              Trusted by{' '}
              <span className="text-muted-foreground font-medium">2,000+</span>{' '}
              educators worldwide
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Right Side: Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16">
        <motion.div
          className="w-full max-w-[420px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile Logo */}
          <motion.div
            className="lg:hidden flex items-center gap-3 mb-10"
            variants={itemVariants}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 overflow-hidden">
              <Image src="/learnova-logo.jpg" alt="Learnova" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground tracking-tight">
                Learnova
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Admin Panel
              </p>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-2xl sm:text-[28px] font-display font-bold text-foreground tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your admin account to continue
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-destructive/8 border border-destructive/15"
            >
              <AlertCircle className="w-4.5 h-4.5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Authentication failed
                </p>
                <p className="text-xs text-destructive/70 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-muted-foreground text-sm font-medium mb-1.5">
                        Email address
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="admin@learnova.com"
                            autoComplete="email"
                            className="h-11 pl-10 pr-4 rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors focus-visible:border-primary focus-visible:ring-primary/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive text-xs mt-1.5 ml-1" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-muted-foreground text-sm font-medium mb-1.5">
                        Password
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                          <Input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-11 pl-10 pr-11 rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 text-sm transition-colors focus-visible:border-primary focus-visible:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive text-xs mt-1.5 ml-1" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-border bg-muted/50 rounded-[5px] size-4"
                        />
                      </FormControl>
                      <Label className="text-sm text-muted-foreground font-normal cursor-pointer select-none">
                        Remember me
                      </Label>
                    </FormItem>
                  )}
                />

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2.5">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2.5">
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-3 my-7"
            variants={itemVariants}
          >
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">
              Demo Access
            </span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Demo Credentials Hint */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-muted/50 border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                  Try with demo credentials
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground/60 font-mono truncate">
                    <span className="text-muted-foreground">Email:</span>{' '}
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue('email', 'admin@learnova.com', {
                          shouldValidate: true,
                        });
                      }}
                      className="text-accent hover:text-accent/80 transition-colors cursor-pointer"
                    >
                      admin@learnova.com
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    <span className="text-muted-foreground font-mono">Password:</span>{' '}
                    <span className="text-muted-foreground">any password</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
