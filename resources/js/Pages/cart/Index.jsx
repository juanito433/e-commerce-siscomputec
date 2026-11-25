import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import CustomerOrderTicketModal from "@/Components/CustomerOrderTicketModal";

// Dentro de tu componente de carrito/checkout:
const { flash } = usePage().props;
const [ticketOrder, setTicketOrder] = useState(null);

const checkoutForm = useForm({
    payment_method: "cash", // "cash" | "card"
    delivery_method: "pickup", // "pickup" | "local_delivery"
    requires_invoice: false,
    billing_data: { rfc: "", business_name: "" },
    accepted_policies: true,
});

useEffect(() => {
    if (flash?.created_order) {
        setTicketOrder(flash.created_order);
    }
}, [flash?.created_order]);

const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    checkoutForm.post(route("orders.store"), {
        preserveScroll: true,
    });
};
