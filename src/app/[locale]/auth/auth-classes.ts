/**
 * Tailwind class constants shared by every auth page (login,
 * register, forgot-password, reset-password). Named after the
 * original CSS-module classes so pages keep the same `styles.foo`
 * accessor via `import { authClasses as styles } from ...`.
 */
export const authClasses = {
  authPage:
    "relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 [background:linear-gradient(135deg,#FFF3EB_0%,#FFF8E6_30%,#FAFAF9_70%,#F5F5F4_100%)] before:pointer-events-none before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:content-[''] before:[background:radial-gradient(circle_at_30%_20%,rgba(255,107,26,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,179,0,0.06)_0%,transparent_50%)] dark:[background:linear-gradient(135deg,#1A1D21_0%,#1C1917_30%,#292524_70%,#1A1D21_100%)] dark:before:[background:radial-gradient(circle_at_30%_20%,rgba(255,133,51,0.06)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,192,26,0.05)_0%,transparent_50%)]",

  authCard:
    "relative w-full max-w-[420px] rounded-[var(--radius-2xl)] border border-white/60 bg-white/80 p-5 backdrop-blur-xl [box-shadow:0_20px_60px_-10px_rgba(26,29,33,0.08),0_8px_20px_-6px_rgba(26,29,33,0.04),0_0_0_1px_rgba(26,29,33,0.03)] min-[481px]:p-10 dark:border-white/[0.08] dark:bg-[#111]/80 dark:[box-shadow:0_20px_60px_-10px_rgba(0,0,0,0.4),0_8px_20px_-6px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]",

  authHeader: "mb-8 text-center",

  logoIcon:
    "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-accent)] text-white shadow-[var(--shadow-accent)]",

  authTitle:
    "m-0 mb-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-text)] min-[481px]:text-[1.75rem]",

  authSubtitle: "m-0 text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)]",

  oauthButton:
    "flex w-full cursor-pointer items-center justify-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[0.9375rem] font-medium text-[var(--color-text)] transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-secondary)] hover:shadow-[var(--shadow-sm)] active:scale-[0.99]",

  googleIcon: "flex-shrink-0",

  separator:
    "my-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-[var(--color-border)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--color-border)] after:content-['']",

  separatorText: "whitespace-nowrap text-[0.8125rem] text-[var(--color-text-tertiary)]",

  form: "flex flex-col gap-4",

  inputGroup: "flex flex-col gap-1.5",

  inputLabel: "text-[0.8125rem] font-medium text-[var(--color-text-secondary)]",

  inputWrapper: "relative flex items-center",

  inputIcon:
    "pointer-events-none absolute left-3 z-[1] text-[var(--color-text-tertiary)] transition-colors duration-200",

  input:
    "peer w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--color-text-tertiary)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-light)]",

  inputToggle:
    "absolute right-2 flex cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border-none bg-transparent p-1 text-[var(--color-text-tertiary)] transition-colors duration-200 hover:text-[var(--color-text-secondary)]",

  inputWithToggle: "pr-10",

  forgotPasswordLink:
    "block text-right text-[0.8125rem] font-medium text-[var(--color-accent)] no-underline transition-opacity duration-200 hover:opacity-80",

  submitButton: "mt-2",

  magicLinkText:
    "block w-full cursor-pointer border-none bg-transparent p-1 text-center text-[0.8125rem] text-[var(--color-text-tertiary)] transition-colors duration-200 hover:text-[var(--color-accent)]",

  magicLinkSent:
    "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 text-center [&_svg]:mx-auto [&_svg]:mb-3 [&_svg]:block [&_svg]:text-[var(--color-accent)] [&_p]:m-0 [&_p]:text-[0.9375rem] [&_p]:leading-relaxed [&_p]:text-[var(--color-text-secondary)]",

  authFooter:
    "mt-7 text-center text-sm text-[var(--color-text-secondary)] [&_a]:font-semibold [&_a]:text-[var(--color-accent)] [&_a]:no-underline [&_a]:transition-opacity [&_a:hover]:opacity-80",

  strengthBarContainer: "mt-1.5 h-1 overflow-hidden rounded-sm bg-[var(--color-bg-tertiary)]",

  strengthBar: "h-full rounded-sm transition-[width,background-color] duration-300",

  strengthText: "mt-1 text-xs transition-colors duration-300",

  termsText:
    "m-0 text-[0.8125rem] leading-relaxed text-[var(--color-text-tertiary)] [&_a]:text-[var(--color-accent)] [&_a]:no-underline [&_a:hover]:underline",
} as const;
