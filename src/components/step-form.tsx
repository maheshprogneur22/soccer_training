'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

// Types
interface BaseFormField {
    name: string;
    label: string;
    required: boolean;
    condition?: (formData: FormDataState) => boolean; // NEW - conditional field display
}

// Password validation rules interface
interface PasswordValidationRules {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    customPattern?: RegExp;
    customMessage?: string;
}

interface TextFormField extends BaseFormField {
    type: 'text' | 'email' | 'number';
    placeholder?: string; // NEW
}

interface PasswordFormField extends BaseFormField {
    type: 'password';
    showToggle?: boolean;
    validation?: string | PasswordValidationRules;
}

interface PhoneFormField extends BaseFormField {
    type: 'phone';
    placeholder?: string;
}

// NEW - SelectFormFieldOption interface
interface SelectFormFieldOption {
    label: string;
    value: string;
}

interface SelectFormField extends BaseFormField {
    type: 'select';
    options: (string | SelectFormFieldOption)[]; // UPDATED - support both string and object options
}

interface TextareaFormField extends BaseFormField {
    type: 'textarea';
    placeholder?: string; // NEW
}

// NEW - DateFormField
interface DateFormField extends BaseFormField {
    type: 'date';
}

interface FileFormField extends BaseFormField {
    type: 'file';
    accept: string;
    maxSizeMB?: number; // MADE OPTIONAL
    path?: string;      // MADE OPTIONAL
}

interface CheckboxFormField extends BaseFormField {
    type: 'checkbox';
}

interface CaptchaFormField extends BaseFormField {
    type: 'captcha';
}

// UPDATED - Added DateFormField to the union
export type FormField = 
    | TextFormField 
    | PasswordFormField 
    | PhoneFormField 
    | SelectFormField 
    | TextareaFormField 
    | FileFormField 
    | CheckboxFormField 
    | CaptchaFormField
    | DateFormField; // NEW

// Step interface
export interface FormStep {
    title: string;
    description?: string;
    fields: FormField[];
    icon?: React.ReactNode;
}

interface StepApplicationFormProps {
    steps: FormStep[];
    onSubmit: (formData: FormData | any) => Promise<void>;
    className?: string;
    autoFilledData?: FormDataState;
    allowStepNavigation?: boolean;
    metaDataName: string;
    // NEW - external loading state and custom button text
    isSubmitting?: boolean;
    submitButtonText?: string;
}

interface FormErrors {
    [key: string]: string;
}

interface FormDataState {
    [key: string]: string | File | null | object | boolean;
}

const StepApplicationForm: React.FC<StepApplicationFormProps> = ({
    steps,
    onSubmit,
    className,
    autoFilledData = {},
    metaDataName,
    allowStepNavigation = true,
    isSubmitting, // NEW
    submitButtonText // NEW
}) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [formData, setFormData] = useState<FormDataState>(autoFilledData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
    const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    // Use external loading state if provided, otherwise fallback to internal state
    const externalLoading = isSubmitting ?? loading; // NEW

    // Restore the form Data
    React.useEffect(() => {
        const stored = localStorage.getItem(`stepApplicationFormMeta-${metaDataName}`);
        if (stored) {
            try {
                const parsedData = JSON.parse(stored);
                setFormData(parsedData.formData || {});
                setCurrentStep(parsedData.currentStep || 0);
                setCompletedSteps(new Set(parsedData.completedSteps || []));
            } catch (error) {
                console.error('Error parsing stored form data:', error);
            }
        }
    }, [metaDataName]);
    

    // Save progress to localStorage
    const saveProgress = (data: FormDataState, step: number, completed: Set<number>) => {
        try {
            localStorage.setItem(`stepApplicationFormMeta-${metaDataName}`, JSON.stringify({
                formData: data,
                currentStep: step,
                completedSteps: Array.from(completed)
            }));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = (fieldName: string) => {
        setPasswordVisibility(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    // Format file size utility
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Phone number formatting function
    const formatPhoneNumber = (value: string): string => {
        const phoneNumber = value.replace(/\D/g, '');
        const limitedPhoneNumber = phoneNumber.slice(0, 10);
        
        if (limitedPhoneNumber.length >= 6) {
            return `${limitedPhoneNumber.slice(0, 3)}-${limitedPhoneNumber.slice(3, 6)}-${limitedPhoneNumber.slice(6)}`;
        } else if (limitedPhoneNumber.length >= 3) {
            return `${limitedPhoneNumber.slice(0, 3)}-${limitedPhoneNumber.slice(3)}`;
        }
        return limitedPhoneNumber;
    };

    // Phone number validation
    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        return phoneRegex.test(cleanPhone);
    };

    // Password validation function
    const validatePassword = (password: string, rules: PasswordValidationRules): string | null => {
        const {
            minLength = 8,
            requireUppercase = true,
            requireLowercase = true,
            requireNumbers = true,
            requireSpecialChars = false,
            customPattern,
            customMessage
        } = rules;

        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long`;
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }

        if (requireLowercase && !/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }

        if (requireNumbers && !/\d/.test(password)) {
            return 'Password must contain at least one number';
        }

        if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character';
        }

        if (customPattern && !customPattern.test(password)) {
            return customMessage || 'Password does not meet the required pattern';
        }

        return null;
    };

    // File remove handler
    const handleFileRemove = async (name: string) => {
        const uploaded = formData[name] as { url?: string; key?: string; name?: string; size?: number; type?: string } | null;

        let key = uploaded?.key;
        if (!key && uploaded?.url) {
            const parts = uploaded.url.split('/');
            key = parts.slice(-2).join('/');
        }

        if (key) {
            try {
                await fetch(`/api/files/delete?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
            } catch (e) {
                console.error('File deletion error:', e);
            }
        }

        const newFormData = { ...formData, [name]: null };
        setFormData(newFormData);
        saveProgress(newFormData, currentStep, completedSteps);
    };

    // Input change handler
    const handleInputChange = (name: string, value: string): void => {
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        saveProgress(newFormData, currentStep, completedSteps);

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Checkbox change handler
    const handleCheckboxChange = (name: string, checked: boolean): void => {
        const newFormData = { ...formData, [name]: checked };
        setFormData(newFormData);
        saveProgress(newFormData, currentStep, completedSteps);

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Phone change handler
    const handlePhoneChange = (name: string, value: string): void => {
        const formattedValue = formatPhoneNumber(value);
        const newFormData = { ...formData, [name]: formattedValue };
        setFormData(newFormData);
        saveProgress(newFormData, currentStep, completedSteps);

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // File change handler
    const handleFileChange = async (name: string, file: File | null, path?: string): Promise<void> => {
        const currentStepFields = steps[currentStep].fields;
        const field = currentStepFields.find(f => f.name === name) as FileFormField;
        const maxSize = field?.maxSizeMB || 5; // Default 5MB if not specified

        if (file && file.size > maxSize * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [name]: `File size should not exceed ${maxSize}MB`
            }));
            return;
        }

        if (file) {
            try {
                const fileFormData = new FormData();
                fileFormData.append('file', file);
                if (path) {
                    fileFormData.append('path', path);
                }

                const res = await fetch('/api/files/upload', {
                    method: 'POST',
                    body: fileFormData,
                });
                const data = await res.json();

                if (data.success && data.url) {
                    const fileData = {
                        url: data.url,
                        name: file.name,
                        key: data.key,
                        size: file.size,
                        type: file.type,
                    };

                    const newFormData = { ...formData, [name]: fileData };
                    setFormData(newFormData);
                    saveProgress(newFormData, currentStep, completedSteps);
                    
                    setErrors(prev => ({
                        ...prev,
                        [name]: ''
                    }));
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            } catch (error: any) {
                setErrors(prev => ({
                    ...prev,
                    [name]: error.message || 'Upload failed'
                }));
            }
        } else {
            const newFormData = { ...formData, [name]: null };
            setFormData(newFormData);
            saveProgress(newFormData, currentStep, completedSteps);
        }
    };

    // UPDATED - Validate current step with condition filtering
    const validateCurrentStep = (): boolean => {
        const newErrors: FormErrors = {};
        const currentFields = steps[currentStep].fields
            .filter(field => !field.condition || field.condition(formData)); // NEW - filter by condition

        currentFields.forEach(field => {
            const fieldValue = formData[field.name];

            // Required field validation
            if (field.required) {
                if (field.type === 'checkbox' && !fieldValue) {
                    newErrors[field.name] = `Please check ${field.label}`;
                } else if (field.type !== 'checkbox' && (!fieldValue || (typeof fieldValue === 'string' && !fieldValue.trim()))) {
                    newErrors[field.name] = `${field.label} is required`;
                }
            }

            // Email validation
            if (field.type === 'email' && fieldValue && typeof fieldValue === 'string') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    newErrors[field.name] = 'Please enter a valid email address';
                }
            }

            // Phone validation
            if (field.type === 'phone' && fieldValue && typeof fieldValue === 'string') {
                if (!validatePhoneNumber(fieldValue)) {
                    newErrors[field.name] = 'Please enter a valid 10-digit mobile number';
                }
            }

            // Enhanced Password validation
            if (field.type === 'password' && fieldValue && typeof fieldValue === 'string') {
                const passwordField = field as PasswordFormField;
                
                if (typeof passwordField.validation === 'object') {
                    const validationError = validatePassword(fieldValue, passwordField.validation);
                    if (validationError) {
                        newErrors[field.name] = validationError;
                    }
                } else if (passwordField.validation === 'matchPassword') {
                    const passwordValue = formData['password'] as string;
                    if (passwordValue && fieldValue !== passwordValue) {
                        newErrors[field.name] = 'Passwords do not match';
                    }
                } else {
                    const defaultRules: PasswordValidationRules = {
                        minLength: 0,
                        requireUppercase: false,
                        requireLowercase: false,
                        requireNumbers: false,
                        requireSpecialChars: false
                    };
                    const validationError = validatePassword(fieldValue, defaultRules);
                    if (validationError) {
                        newErrors[field.name] = validationError;
                    }
                }
            }

            // Captcha validation
            if (field.name === 'captcha' && field.required && !captchaVerified) {
                newErrors[field.name] = 'Please verify that you are human';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle next step
    const handleNext = () => {
        if (validateCurrentStep()) {
            const newCompletedSteps = new Set([...completedSteps, currentStep]);
            setCompletedSteps(newCompletedSteps);
            
            if (currentStep < steps.length - 1) {
                const newStep = currentStep + 1;
                setCurrentStep(newStep);
                saveProgress(formData, newStep, newCompletedSteps);
            }
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);
            saveProgress(formData, newStep, completedSteps);
        }
    };

    // Handle step navigation (if allowed)
    const handleStepClick = (stepIndex: number) => {
        if (allowStepNavigation && (completedSteps.has(stepIndex) || stepIndex <= currentStep)) {
            setCurrentStep(stepIndex);
            saveProgress(formData, stepIndex, completedSteps);
        }
    };

    // Form submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateCurrentStep()) {
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            setFormData(autoFilledData);
            setCurrentStep(0);
            setCompletedSteps(new Set());
            localStorage.removeItem(`stepApplicationFormMeta-${metaDataName}`);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    // UPDATED - Render field function with new field types
    const renderField = (field: FormField): React.ReactElement => {
        const { name, label, type, required } = field;
        const value = typeof formData[name] === 'string' ? formData[name] as string : '';
        const checkboxValue = typeof formData[name] === 'boolean' ? formData[name] as boolean : false;
        const error = errors[name];

        switch (type) {
            case 'text':
            case 'email':
            case 'number':
                const textField = field as TextFormField;
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2"
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={name}
                            type={type}
                            disabled={!!autoFilledData?.[name]}
                            value={value}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            placeholder={textField.placeholder || `Enter ${label.toLowerCase()}`}
                            className={`w-full ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            // NEW - Date field
            case 'date':
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2"
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={name}
                            type="date"
                            disabled={!!autoFilledData?.[name]}
                            value={value}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            className={`w-full ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            case 'password':
                const passwordField = field as PasswordFormField;
                const isVisible = passwordVisibility[name] || false;
                
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2"
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <div className="relative">
                            <Input
                                id={name}
                                type={isVisible ? 'text' : 'password'}
                                disabled={!!autoFilledData?.[name]}
                                value={value}
                                onChange={(e) => handleInputChange(name, e.target.value)}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                className={`w-full pr-10 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            />
                            {passwordField.showToggle && (
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => togglePasswordVisibility(name)}
                                >
                                    {isVisible ? (
                                        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l-1.414 1.414m4.242 4.242l1.414 1.414M14.12 14.12l1.414 1.414" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={name} className="w-full min-w-0">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id={name}
                                checked={checkboxValue}
                                disabled={!!autoFilledData?.[name]}
                                onCheckedChange={(checked) => handleCheckboxChange(name, checked as boolean)}
                                className={`mt-1 flex-shrink-0 ${error ? 'border-destructive' : ''}`}
                            />
                            <Label
                                htmlFor={name}
                                className="text-sm font-medium text-primary cursor-pointer leading-5 flex-1"
                            >
                                {label}
                                {required && <span className="text-destructive ml-1">*</span>}
                            </Label>
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 mt-1 ml-7">{error}</p>
                        )}
                    </div>
                );

            case 'phone':
                const phoneField = field as PhoneFormField;
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2"
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">+91</span>
                            </div>
                            <Input
                                id={name}
                                type="tel"
                                value={value}
                                disabled={!!autoFilledData?.[name]}
                                onChange={(e) => handlePhoneChange(name, e.target.value)}
                                placeholder={phoneField.placeholder || "XXX-XXX-XXXX"}
                                className={`w-full pl-12 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                maxLength={12}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Enter 10-digit mobile number (starting with 6-9)
                        </p>
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            // UPDATED - Select field with object and string options support
            case 'select':
                const selectField = field as SelectFormField;
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label className="block text-sm font-medium text-primary mb-2">
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Select
                            value={value}
                            disabled={!!autoFilledData?.[name]}
                            onValueChange={(selectedValue: string) => handleInputChange(name, selectedValue)}
                        >
                            <SelectTrigger className={`w-full ${error ? 'border-destructive' : ''}`}>
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {selectField.options.map((option, index) => {
                                    const optValue = typeof option === 'string' ? option : option.value;
                                    const optLabel = typeof option === 'string' ? option : option.label;
                                    return (
                                        <SelectItem key={index} value={optValue}>
                                            {optLabel}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            case 'textarea':
                const textareaField = field as TextareaFormField;
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2"
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Textarea
                            id={name}
                            disabled={!!autoFilledData?.[name]}
                            value={value}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            placeholder={textareaField.placeholder || `Enter ${label.toLowerCase()}`}
                            className={`w-full min-h-[100px] resize-y ${error ? 'border-destructive' : ''}`}
                            rows={4}
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            case 'file':
                const fileField = field as FileFormField;
                const uploadedFile = formData[name] as { url: string; name: string; size: number; key: string; type: string } | null;

                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2"
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>

                        {!uploadedFile ? (
                            <Input
                                id={name}
                                type="file"
                                disabled={!!autoFilledData?.[name]}
                                accept={fileField.accept}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    handleFileChange(name, e.target.files?.[0] || null, fileField.path)
                                }
                                className={`w-full cursor-pointer ${error ? 'border-destructive' : ''}`}
                            />
                        ) : (
                            <div className={`w-full p-3 border-2 border-dashed rounded-lg bg-green-50 border-green-200 ${error ? 'border-destructive' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-green-800 truncate">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="text-xs text-green-600">
                                                {formatFileSize(uploadedFile.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileRemove(name)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                    >
                                        ✕
                                    </Button>
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1">
                            Accepted: {fileField.accept}. Max: {fileField.maxSizeMB || 5}MB
                        </p>
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            case 'captcha':
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label className="block text-sm font-medium text-primary mb-3">
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <div
                            className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors max-w-[280px] ${
                                captchaVerified
                                    ? 'bg-green-50 border-green-200'
                                    : error
                                    ? 'bg-red-50 border-destructive'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => setCaptchaVerified(!captchaVerified)}
                        >
                            <Checkbox
                                checked={captchaVerified}
                                onCheckedChange={(checked: boolean) => setCaptchaVerified(checked as boolean)}
                                className={`flex-shrink-0 ${error ? 'border-destructive' : ''}`}
                            />
                            <Label className="text-sm cursor-pointer">
                                I'm not a robot
                            </Label>
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                );

            default:
                return <div key={name} className="hidden"></div>;
        }
    };

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    // UPDATED - Filter fields by condition before rendering
    const currentStepFields = currentStepData?.fields.filter(field => 
        !field.condition || field.condition(formData)
    ) || [];

    return (
        <div className={`${className} my-5 w-full max-w-4xl mx-auto`}>
            {/* Step Progress Indicator */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                        Step {currentStep + 1} of {steps.length}
                    </span>
                </div>
                
                <div className="flex items-center space-x-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                                    index === currentStep
                                        ? 'bg-blue-600 text-white'
                                        : completedSteps.has(index)
                                        ? 'bg-green-600 text-white'
                                        : index < currentStep
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-200 text-gray-600'
                                } ${allowStepNavigation && (completedSteps.has(index) || index <= currentStep) ? 'hover:bg-blue-500' : ''}`}
                                onClick={() => handleStepClick(index)}
                            >
                                {completedSteps.has(index) ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 rounded ${
                                    index < currentStep || completedSteps.has(index)
                                        ? 'bg-green-600'
                                        : 'bg-gray-200'
                                }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Names */}
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center" style={{ width: '40px' }}>
                            {step.title}
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Step Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        {currentStepData?.icon}
                        <span>{currentStepData?.title}</span>
                    </h3>
                    {currentStepData?.description && (
                        <p className="text-gray-600 mt-2">{currentStepData?.description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentStepFields.map(field => {
                            const isFullWidth = field.type === 'textarea' || field.type === 'checkbox' || field.type === 'captcha';
                            
                            return (
                                <div
                                    key={field.name}
                                    className={`${isFullWidth ? 'md:col-span-2' : ''}`}
                                >
                                    {renderField(field)}
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="flex items-center space-x-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </Button>

                        <div className="flex space-x-3">
                            {!isLastStep ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center space-x-2"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={externalLoading} // UPDATED - use external loading
                                    className="flex items-center space-x-2"
                                >
                                    {externalLoading ? ( // UPDATED
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>{submitButtonText || 'Submitting...'}</span> {/* UPDATED */}
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>{submitButtonText || 'Submit Application'}</span> {/* UPDATED */}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StepApplicationForm;


// Example usage:
export const sampleSteps: FormStep[] = [
    {
        title: "Personal Info",
        description: "Basic personal information",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
        fields: [
            {
                name: "firstName",
                label: "First Name",
                type: "text",
                required: true,
            },
            {
                name: "lastName",
                label: "Last Name",
                type: "text",
                required: true,
            },
            {
                name: "email",
                label: "Email Address",
                type: "email",
                required: true,
            },
            {
                name: "phone",
                label: "Phone Number",
                type: "phone",
                required: true,
            }
        ]
    },
    {
        title: "Account Setup",
        description: "Create your secure account",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>,
        fields: [
            {
                name: "password",
                label: "Password",
                type: "password",
                required: true,
                showToggle: true,
                validation: {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                }
            },
            {
                name: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                required: true,
                showToggle: true,
                validation: "matchPassword"
            }
        ]
    },
    {
        title: "Documents",
        description: "Upload required documents",
        icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>,
        fields: [
            {
                name: "resume",
                label: "Upload Resume",
                type: "file",
                required: true,
                accept: ".pdf,.doc,.docx",
                maxSizeMB: 2,
                path: "documents/resume"
            }
        ]
    },
    {
        title: "Final Step",
        description: "Review and confirm your information",
        icon: <Check className="w-5 h-5" />,
        fields: [
            {
                name: "termsConditions",
                label: "I accept the terms and conditions",
                type: "checkbox",
                required: true,
            },
            {
                name: "captcha",
                label: "Verify you are human",
                type: "captcha",
                required: true,
            }
        ]
    }
];
