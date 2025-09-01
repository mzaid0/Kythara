import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, FieldPath, FieldValues } from "react-hook-form"

interface InputFormFieldProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    placeholder?: string
    description?: string
    type?: string
    formControl: Control<T>
}

const InputFormField = <T extends FieldValues>({ name, label, placeholder, description, type, formControl }: InputFormFieldProps<T>) => {
    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={type || "text"}
                            {...field}
                            value={field.value?.toString() || ''}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default InputFormField