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

// Types
interface BaseFormField {
    name: string;
    label: string;
    required: boolean;
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

interface SelectFormField extends BaseFormField {
    type: 'select';
    options: string[];
}

interface TextareaFormField extends BaseFormField {
    type: 'textarea';
}

interface FileFormField extends BaseFormField {
    type: 'file';
    accept: string;
    maxSizeMB: number;
    path: string;
}

interface CheckboxFormField extends BaseFormField {
    type: 'checkbox';
}

interface CaptchaFormField extends BaseFormField {
    type: 'captcha';
}

export type FormField = 
    | TextFormField 
    | PasswordFormField 
    | PhoneFormField 
    | SelectFormField 
    | TextareaFormField 
    | FileFormField 
    | CheckboxFormField 
    | CaptchaFormField;

interface ApplicationFormProps {
    applicationFormFields: FormField[];
    onSubmit: (formData: FormData | any) => Promise<void>;
    className?: string;
    autoFilledData?: FormDataState
}

interface FormErrors {
    [key: string]: string;
}

interface FormDataState {
    [key: string]: string | File | null | object | boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
    applicationFormFields,
    onSubmit,
    className,
    autoFilledData = {}
}) => {
    const [formData, setFormData] = useState<FormDataState>(autoFilledData);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
    const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

    // Restore the form Data
    React.useEffect(() => {
        const stored = localStorage.getItem('applicationFormMeta');
        if (stored) {
            try {
                const parsedData = JSON.parse(stored);
                setFormData(parsedData);
            } catch (error) {
                console.error('Error parsing stored form data:', error);
            }
        }
    }, []);

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
        // Remove all non-digits
        const phoneNumber = value.replace(/\D/g, '');
        
        // Limit to 10 digits for Indian numbers
        const limitedPhoneNumber = phoneNumber.slice(0, 10);
        
        // Format as XXX-XXX-XXXX
        if (limitedPhoneNumber.length >= 6) {
            return `${limitedPhoneNumber.slice(0, 3)}-${limitedPhoneNumber.slice(3, 6)}-${limitedPhoneNumber.slice(6)}`;
        } else if (limitedPhoneNumber.length >= 3) {
            return `${limitedPhoneNumber.slice(0, 3)}-${limitedPhoneNumber.slice(3)}`;
        }
        return limitedPhoneNumber;
    };

    // Phone number validation
    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number pattern
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

        // Check minimum length
        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long`;
        }

        // Check uppercase requirement
        if (requireUppercase && !/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }

        // Check lowercase requirement
        if (requireLowercase && !/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }

        // Check numbers requirement
        if (requireNumbers && !/\d/.test(password)) {
            return 'Password must contain at least one number';
        }

        // Check special characters requirement
        if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character';
        }

        // Check custom pattern
        if (customPattern && !customPattern.test(password)) {
            return customMessage || 'Password does not meet the required pattern';
        }

        return null; // Password is valid
    };

    // File remove handler
    const handleFileRemove = async (name: string) => {
        const uploaded = formData[name] as { url?: string; key?: string; name?: string; size?: number; type?: string } | null;

        // URL/key extract karo
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

        // Form data se hatao
        setFormData(prev => ({
            ...prev,
            [name]: null
        }));

        // Local Storage update karo
        saveMetaToLocalStorage({
            ...formData,
            [name]: null
        });
    };

    // Input change handler
    const handleInputChange = (name: string, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Checkbox change handler
    const handleCheckboxChange = (name: string, checked: boolean): void => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));

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
        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // File change handler
    const handleFileChange = async (name: string, file: File | null, path: string): Promise<void> => {
        const field = applicationFormFields.find(f => f.name === name) as FileFormField;
        const maxSize = field?.maxSizeMB || 1;

        if (file && file.size > maxSize * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [name]: `File size should not exceed ${maxSize}MB`
            }));
            return;
        }

        if (file) {
            try {
                // create formData to send the file to s3 bucket
                const fileFormData = new FormData();
                fileFormData.append('file', file);
                fileFormData.append('path', path);

                // API call to upload file
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

                    setFormData(prev => ({
                        ...prev,
                        [name]: fileData
                    }));
                    
                    setErrors(prev => ({
                        ...prev,
                        [name]: ''
                    }));

                    // save to local storage
                    saveMetaToLocalStorage({
                        ...formData,
                        [name]: fileData
                    });
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
            setFormData(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Enhanced form validation with flexible password rules
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        applicationFormFields.forEach(field => {
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
                    // Custom validation rules object
                    const validationError = validatePassword(fieldValue, passwordField.validation);
                    if (validationError) {
                        newErrors[field.name] = validationError;
                    }
                } else if (passwordField.validation === 'matchPassword') {
                    // Match password validation
                    const passwordValue = formData['password'] as string;
                    if (passwordValue && fieldValue !== passwordValue) {
                        newErrors[field.name] = 'Passwords do not match';
                    }
                } else {
                    // Default password validation rules
                    const defaultRules: PasswordValidationRules = {
                        minLength: 8,
                        requireUppercase: true,
                        requireLowercase: true,
                        requireNumbers: true,
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

    // Save to local storage
    const saveMetaToLocalStorage = (formData: FormDataState) => {
        try {
            localStorage.setItem('applicationFormMeta', JSON.stringify(formData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    // Form submit handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value instanceof File) {
                    submitData.append(key, value);
                } else if (typeof value === 'string' && value.trim()) {
                    // Clean phone number before submitting (remove dashes)
                    const cleanValue = (key.includes('phone') || key.includes('mobile'))
                        ? value.replace(/\D/g, '')
                        : value;
                    submitData.append(key, cleanValue);
                } else if (typeof value === 'boolean') {
                    submitData.append(key, value.toString());
                } else if (value && typeof value === 'object') {
                    // Handle file objects
                    submitData.append(key, JSON.stringify(value));
                }
            });

            await onSubmit(formData);
            setFormData(autoFilledData);
            localStorage.removeItem('applicationFormMeta');

        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Render field function
    const renderField = (field: FormField): React.ReactElement => {
        const { name, label, type, required } = field;
        const value = typeof formData[name] === 'string' ? formData[name] as string : '';
        const checkboxValue = typeof formData[name] === 'boolean' ? formData[name] as boolean : false;
        const error = errors[name];

        switch (type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[200px] inline-block">
                                {label}
                            </span>
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={name}
                            type={type}
                            disabled={!!autoFilledData?.[name]}
                            value={value}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            className={`w-full text-foreground ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
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
                            className="block text-sm font-medium text-primary mb-2 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[200px] inline-block">
                                {label}
                            </span>
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
                                className={`w-full text-foreground pr-10 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
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
                                className={`mt-1 flex-shrink-0 ${error ? 'border-destructive data-[state=checked]:bg-destructive' : ''}`}
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
                            <p className="text-sm text-red-600 mt-1 ml-7 truncate w-full" title={error}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'phone':
                const phoneField = field as PhoneFormField;
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[200px] inline-block">
                                {label}
                            </span>
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
                                className={`w-full pl-12 text-foreground ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                maxLength={12} // XXX-XXX-XXXX format
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Enter 10-digit mobile number (starting with 6-9)
                        </p>
                        {error && (
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'select':
                const selectField = field as SelectFormField;
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            className="block text-sm font-medium text-primary mb-2 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[200px] inline-block">
                                {label}
                            </span>
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Select
                            value={value}
                            disabled={!!autoFilledData?.[name]}
                            onValueChange={(selectedValue: string) => handleInputChange(name, selectedValue)}
                        >
                            <SelectTrigger
                                className={`w-full ${error ? 'border-destructive focus:ring-destructive' : ''}`}
                            >
                                <SelectValue
                                    placeholder={
                                        <span className="truncate max-w-[180px] inline-block">
                                            Select {label.toLowerCase()}
                                        </span>
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {selectField.options.map((option, index) => (
                                    <SelectItem key={index} value={option}>
                                        <span
                                            className="truncate text-foreground max-w-[250px] inline-block"
                                            title={option}
                                        >
                                            {option}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error && (
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            htmlFor={name}
                            className="block text-sm font-medium text-primary mb-2 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[300px] inline-block">
                                {label}
                            </span>
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Textarea
                            id={name}
                            disabled={!!autoFilledData?.[name]}
                            value={value}
                            onChange={(e) => handleInputChange(name, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            className={`w-full text-foreground min-h-[100px] resize-y ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            rows={4}
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
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
                            className="block text-sm font-medium text-primary mb-2 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[300px] inline-block">
                                {label}
                            </span>
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
                                className={`w-full cursor-pointer ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                            />
                        ) : (
                            <div className={`w-full p-3 border-2 border-dashed rounded-lg bg-green-50 border-green-200 ${error ? 'border-destructive' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-green-800 truncate" title={uploadedFile.name}>
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
                                        className="text-red-600 hover:text-red-800 hover:bg-red-100 flex-shrink-0"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-1 truncate w-full">
                            <span title={`Accepted: ${fileField.accept}. Max: ${fileField.maxSizeMB}MB`}>
                                Accepted: {fileField.accept}. Max: {fileField.maxSizeMB}MB
                            </span>
                        </p>
                        {error && (
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            case 'captcha':
                return (
                    <div key={name} className="w-full min-w-0">
                        <Label
                            className="block text-sm font-medium text-primary mb-3 truncate w-full"
                            title={label}
                        >
                            <span className="truncate max-w-[300px] inline-block">
                                {label}
                            </span>
                            {required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <div
                            className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors w-full max-w-[280px] ${
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
                            <Label className="text-sm cursor-pointer truncate flex-1 min-w-0">
                                I'm not a robot
                            </Label>
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 mt-1 truncate w-full" title={error}>
                                {error}
                            </p>
                        )}
                    </div>
                );

            default:
                return <div key={name} className="hidden"></div>;
        }
    };

    return (
        <div className={`${className} my-5 w-full mx-auto p-6 bg-card rounded-xl shadow-lg`}>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {applicationFormFields.map(field => {
                        const isFullWidth = ['message', 'cv', 'captcha', 'marketingEmails', 'termsConditions'].includes(field.name) || field.type === 'textarea' || field.type === 'checkbox';

                        return (
                            <div
                                key={field.name}
                                className={`w-full min-w-0 ${isFullWidth ? 'md:col-span-2' : ''}`}
                            >
                                {renderField(field)}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center pt-6 border-t border-border">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 w-full max-w-[240px] font-medium"
                        size="lg"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                <span className="truncate">Submitting...</span>
                            </div>
                        ) : (
                            <span className="truncate">Submit Application</span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;

// // Example usage with custom password validation:
// export const sampleFormFields: FormField[] = [
//     {
//         name: "email",
//         label: "Email Address",
//         type: "email",
//         required: true,
//     },
//     {
//         name: "password",
//         label: "Password",
//         type: "password",
//         required: true,
//         showToggle: true,
//         validation: {
//             minLength: 10,
//             requireUppercase: true,
//             requireLowercase: true,
//             requireNumbers: true,
//             requireSpecialChars: true,
//         }
//     },
//     {
//         name: "confirmPassword",
//         label: "Confirm Password",
//         type: "password",
//         required: true,
//         showToggle: true,
//         validation: "matchPassword"
//     },
//     {
//         name: "termsConditions",
//         label: "I accept the terms and conditions",
//         type: "checkbox",
//         required: true,
//     }
// ];
