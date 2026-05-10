'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';
import { auditInputSchema, AuditInput, AuditPlanEnum, SupportedToolEnum, UseCaseEnum } from '../../lib/validators/audit-schema';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

const defaultTool: AuditInput['tools'][0] = {
  id: `tool-${Date.now()}`,
  tool: 'ChatGPT',
  plan: 'Team',
  monthlySpend: 500,
  seats: 3,
  useCase: 'Coding'
};

export function AuditForm() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AuditInput>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: {
      teamSize: 5,
      primaryUseCase: 'Mixed',
      email: '',
      company: '',
      role: '',
      notes: '',
      tools: [defaultTool]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'tools' });
  const tools = watch('tools');

  useEffect(() => {
    setHasMounted(true);
    const raw = window.localStorage.getItem('ai-spend-audit');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.tools) {
          setValue('teamSize', parsed.teamSize ?? 5);
          setValue('primaryUseCase', parsed.primaryUseCase ?? 'Mixed');
          setValue('email', parsed.email ?? '');
          setValue('company', parsed.company ?? '');
          setValue('role', parsed.role ?? '');
          setValue('notes', parsed.notes ?? '');
          setValue('tools', parsed.tools);
        }
      } catch {
        return;
      }
    }
  }, [setValue]);

  useEffect(() => {
    if (!hasMounted) return;
    const subscription = watch((value) => {
      window.localStorage.setItem('ai-spend-audit', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [hasMounted, watch]);

  const toolOptions = useMemo(() => SupportedToolEnum.options, []);
  const planOptions = useMemo(() => AuditPlanEnum.options, []);
  const useCaseOptions = useMemo(() => UseCaseEnum.options, []);
  const totalSpend = useMemo(() => tools?.reduce((sum, tool) => sum + Number(tool?.monthlySpend ?? 0), 0) ?? 0, [tools]);

  const onSubmit = async (values: AuditInput) => {
    setSubmitError(null);
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      const result = await response.json();
      window.sessionStorage.setItem('ai-spend-audit-result', JSON.stringify(result));
      router.push('/results');
      return;
    }

    setSubmitError('Unable to generate the audit. Please try again or refresh the page.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div>
            <Label htmlFor="teamSize">Team size</Label>
            <Input id="teamSize" type="number" min={1} {...register('teamSize', { valueAsNumber: true })} />
            <p className="mt-2 text-sm text-rose-400">{errors.teamSize?.message}</p>
          </div>
          <div>
            <Label htmlFor="primaryUseCase">Primary use case</Label>
            <Select id="primaryUseCase" {...register('primaryUseCase')}>
              {useCaseOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
            <p className="mt-2 text-sm text-rose-400">{errors.primaryUseCase?.message}</p>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            <p className="mt-2 text-sm text-rose-400">{errors.email?.message}</p>
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register('company')} />
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div key={field.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Tool {index + 1}</h3>
                    <p className="text-sm text-slate-400">Add your AI tool and plan details.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-sm font-medium text-rose-300 transition hover:border-rose-400 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
                <div className="grid gap-6 lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <Label htmlFor={`tools.${index}.tool`}>Tool</Label>
                    <Select id={`tools.${index}.tool`} {...register(`tools.${index}.tool` as const)}>
                      {toolOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="lg:col-span-1">
                    <Label htmlFor={`tools.${index}.plan`}>Plan</Label>
                    <Select id={`tools.${index}.plan`} {...register(`tools.${index}.plan` as const)}>
                      {planOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="lg:col-span-1">
                    <Label htmlFor={`tools.${index}.useCase`}>Use case</Label>
                    <Select id={`tools.${index}.useCase`} {...register(`tools.${index}.useCase` as const)}>
                      {useCaseOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="lg:col-span-1">
                    <Label htmlFor={`tools.${index}.monthlySpend`}>Monthly spend</Label>
                    <Input id={`tools.${index}.monthlySpend`} type="number" min={0} step={50} {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })} />
                  </div>
                  <div className="lg:col-span-1">
                    <Label htmlFor={`tools.${index}.seats`}>Seats</Label>
                    <Input id={`tools.${index}.seats`} type="number" min={1} {...register(`tools.${index}.seats`, { valueAsNumber: true })} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={() => append({ ...defaultTool, id: `tool-${Date.now()}` })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add another tool
          </Button>
        </div>
      </div>

      <Card className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...register('role')} />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="notes">Audit notes</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Optional context for your audit report." />
          </div>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6 shadow-inner">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Estimated spend</p>
          <p className="mt-3 text-3xl font-semibold text-white">${totalSpend.toLocaleString()}</p>
          <p className="mt-2 text-sm text-slate-400">Your total spend updates automatically as you add tools.</p>
        </div>
      </Card>

      {submitError ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {submitError}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">All fields are saved locally until submission.</div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Generating audit...' : 'Generate audit'}
        </Button>
      </div>
    </form>
  );
}
