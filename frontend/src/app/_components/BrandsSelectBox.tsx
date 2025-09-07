import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { showErrorToast, showSuccessToast } from '@/components/ui/toast'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { handleError } from '@/errors/handleError'
import { cn } from '@/lib/utils'
import { axiosClient } from '@/utils/axiosClient'
import { Check, ChevronsUpDown, Edit2, Plus, Search, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Brand {
    id: number
    name: string
    createdAt: string
    updatedAt: string
}

interface BrandSelectBoxProps {
    value?: number | null
    onSelect?: (brand: Brand | null) => void
    disabled?: boolean
    label?: string
    placeholder?: string
}

const BrandSelectBox = ({ value, onSelect, disabled, label = "Brand", placeholder = "Select brand..." }: BrandSelectBoxProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [open, setOpen] = useState(false)
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('brandSearch') || '')
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
    const [brandName, setBrandName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)

    const selectedBrand = value ? brands.find(brand => brand.id === value) || null : null

    const updateSearchParams = (search: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (search.trim()) {
            params.set('brandSearch', search.trim())
        } else {
            params.delete('brandSearch')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleSearchChange = (search: string) => {
        setSearchQuery(search)
        updateSearchParams(search)
    }

    const fetchBrands = async (search = '') => {
        try {
            setLoading(true)
            const queryParam = search ? `?search=${encodeURIComponent(search)}` : ''
            const response = await axiosClient.get(`/brands${queryParam}`)
            setBrands(response.data)
        } catch (error: unknown) {
            handleError(error, 'Failed to fetch brands')
        } finally {
            setLoading(false)
        }
    }

    const createBrand = async () => {
        if (!brandName.trim()) {
            showErrorToast('Brand name is required')
            return
        }
        try {
            setSubmitting(true)
            const response = await axiosClient.post('/brands', {
                name: brandName.trim()
            })
            showSuccessToast('Brand created successfully')
            setBrandName('')
            setAddDialogOpen(false)
            await fetchBrands(searchQuery)
            if (onSelect) {
                onSelect(response.data.brand)
            }
        } catch (error: unknown) {
            handleError(error, 'Failed to create brand')
        } finally {
            setSubmitting(false)
        }
    }

    const updateBrand = async () => {
        if (!editingBrand || !brandName.trim()) {
            showErrorToast('Brand name is required')
            return
        }
        try {
            setSubmitting(true)
            await axiosClient.patch(`/brands/${editingBrand.id}`, {
                name: brandName.trim()
            })
            showSuccessToast('Brand updated successfully')
            setBrandName('')
            setEditDialogOpen(false)
            setEditingBrand(null)
            await fetchBrands(searchQuery)
        } catch (error: unknown) {
            handleError(error, 'Failed to update brand')
        } finally {
            setSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        if (!brandToDelete) return
        try {
            await axiosClient.delete(`/brands/${brandToDelete.id}`)
            showSuccessToast('Brand deleted successfully')
            await fetchBrands(searchQuery)
            if (selectedBrand?.id === brandToDelete.id && onSelect) {
                onSelect(null)
            }
        } catch (error: unknown) {
            handleError(error, 'Failed to delete brand')
        } finally {
            setDeleteDialogOpen(false)
            setBrandToDelete(null)
        }
    }

    const handleEditClick = (brand: Brand, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingBrand(brand)
        setBrandName(brand.name)
        setEditDialogOpen(true)
    }

    const handleDeleteClick = (brand: Brand, e: React.MouseEvent) => {
        e.stopPropagation()
        setBrandToDelete(brand)
        setDeleteDialogOpen(true)
    }

    const handleSelect = (brand: Brand) => {
        onSelect?.(brand)
        setOpen(false)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchBrands(searchQuery)
        }, 300)
        return () => clearTimeout(timeout)
    }, [searchQuery])

    useEffect(() => {
        fetchBrands()
    }, [])

    return (
        <TooltipProvider>
            <div className="space-y-2">
                <Label className="text-sm font-medium">{label}</Label>
                <div className="flex gap-2">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                disabled={disabled}
                                className="flex-1 justify-between"
                            >
                                {selectedBrand ? selectedBrand.name : placeholder}
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <div className="flex items-center border-b px-3">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <input
                                        placeholder="Search brands..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <CommandList>
                                    <CommandEmpty>
                                        {loading ? 'Searching...' : 'No brands found.'}
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {brands.map((brand) => (
                                            <CommandItem
                                                key={brand.id}
                                                value={brand.name}
                                                onSelect={() => handleSelect(brand)}
                                                className="flex cursor-pointer items-center justify-between group"
                                            >
                                                <div className="flex items-center flex-1">
                                                    <span className="flex-1">{brand.name}</span>
                                                    <Check
                                                        className={cn(
                                                            'h-4 w-4 ml-2',
                                                            selectedBrand?.id === brand.id
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0"
                                                                onClick={(e) => handleEditClick(brand, e)}
                                                            >
                                                                <Edit2 className="h-3 w-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit brand</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                                onClick={(e) => handleDeleteClick(brand, e)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete brand</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={disabled}
                                onClick={() => setAddDialogOpen(true)}
                                className="px-3"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add new brand</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Brand</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="brandName">Brand Name</Label>
                                <Input
                                    id="brandName"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    placeholder="Enter brand name"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            createBrand()
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setAddDialogOpen(false)
                                        setBrandName('')
                                    }}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={createBrand} disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Brand'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Brand</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="editBrandName">Brand Name</Label>
                                <Input
                                    id="editBrandName"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    placeholder="Enter brand name"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            updateBrand()
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditDialogOpen(false)
                                        setBrandName('')
                                        setEditingBrand(null)
                                    }}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={updateBrand} disabled={submitting}>
                                    {submitting ? 'Updating...' : 'Update Brand'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                <span className="font-semibold">{brandToDelete?.name}</span>? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setDeleteDialogOpen(false)
                                    setBrandToDelete(null)
                                }}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={confirmDelete}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    )
}

export default BrandSelectBox