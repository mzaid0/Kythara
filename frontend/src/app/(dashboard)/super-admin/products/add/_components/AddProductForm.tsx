"use client"
import BrandSelectBox from "@/app/_components/BrandsSelectBox"
import InputFormField from "@/app/_components/InputFormField"
import SearchableSelect from "@/app/_components/SearchableSelect"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { productSchema, ProductSchemaValues } from "@/validators/productSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

const AddProductForm = () => {
    const form = useForm<ProductSchemaValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            brand: "",
            description: "",
            gender: "MEN",
            price: 0,
            stock: 0,
            soldCount: 0,
            rating: 0,
            isFeatured: false,
            isOnSale: false,
            status: "ACTIVE",
            categoryId: 0,
            imageUrls: [""],
            specifications: []
        }
    })

    const statusOptions = [
        { id: "ACTIVE", name: "Active" },
        { id: "INACTIVE", name: "Inactive" },
        { id: "OUT_OF_STOCK", name: "Out of Stock" }
    ]

    const onSubmit = (data: ProductSchemaValues) => {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <InputFormField
                    name="name"
                    placeholder="Product Name"
                    formControl={form.control}
                    label="Name"
                />

                <Controller
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                        <BrandSelectBox
                            label="Brand"
                            placeholder="Select brand..."
                            value={null}
                            disabled={form.formState.isSubmitting}
                            onSelect={(brand) => field.onChange(brand?.name ?? "")}
                        />
                    )}
                />

                <div className="space-y-2">
                    <SearchableSelect
                        label="Status"
                        options={statusOptions}
                        value={form.watch("status")}
                        onSelect={(option) => {
                            form.setValue("status", option?.id as "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK")
                        }}
                    />
                </div>


                <Button type="submit">Add Product</Button>
            </form>
        </Form>
    )
}

export default AddProductForm