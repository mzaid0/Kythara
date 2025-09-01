import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

interface Option {
    id: string | number
    name: string
}

interface SearchableSelectProps {
    options: Option[]
    placeholder?: string
    searchPlaceholder?: string
    onSelect?: (option: Option | null) => void
    disabled?: boolean
    value?: string | number | null
    label?: string
}

const SearchableSelect = ({
    options,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    onSelect,
    disabled,
    value,
    label
}: SearchableSelectProps) => {
    const [open, setOpen] = useState(false)

    const selectedOption = value ? options.find(opt => opt.id === value) || null : null

    const handleSelect = (option: Option) => {
        onSelect?.(option)
        setOpen(false)
    }

    return (
        <>
            <Label className="text-sm font-medium">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className="w-full justify-between"
                    >
                        {selectedOption ? selectedOption.name : placeholder}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>No option found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        value={option.name}
                                        onSelect={() => handleSelect(option)}
                                        className="flex cursor-pointer items-center justify-between"
                                    >
                                        <span>{option.name}</span>
                                        <Check
                                            className={cn(
                                                'h-4 w-4',
                                                selectedOption?.id === option.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default SearchableSelect