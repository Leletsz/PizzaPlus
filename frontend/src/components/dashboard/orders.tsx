"use client";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { Order } from "@/lib/types";
import { Eye, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatPrice } from "@/lib/format";
import { OrderModal } from "./order-modal";

interface OrdersProps {
  token: string;
}

export function Orders({ token }: OrdersProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<null | string>(null);

  const fetchOrders = async () => {
    try {
      const response = await apiClient<Order[]>("/orders?draft=false", {
        method: "GET",
        cache: "no-store",
        token: token,
      });

      const pendingOrders = response.filter((order) => !order.status);

      setOrders(pendingOrders);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      await fetchOrders();
    }
    loadOrders();
  }, []);

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.amount;
    }, 0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-center sm:text-3xl font-bold text-white">
            Pedidos
          </h1>
        </div>
        <Button className="bg-brand-primary" onClick={fetchOrders}>
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </div>
      {loading ? (
        <div>
          <p>Carregando Pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div>
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-app-card border-app-border text-white"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg lg:text-xl font-bold">
                    Mesa {order.table}
                  </CardTitle>
                  <Badge variant={"secondary"} className="text-xs select-none">
                    Produção
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 mt-auto">
                <div>
                  {order.items && order.items.length > 0 && (
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((items) => (
                        <p
                          key={items.id}
                          className="text-xs sm:text-sm text-gray-300 truncate"
                        >
                          - {items.amount}x {items.product.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-app-border gap-3">
                  <div className="self-start">
                    <p className="text-sm md:text-base text-gray-400">Total</p>
                    <p className="text-base font-bold text-brand-primary">
                      {formatPrice(calculateOrderTotal(order))}
                    </p>
                  </div>
                  <Button
                    size={"sm"}
                    className="bg-brand-primary w-full md:w-auto"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <Eye></Eye>Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <OrderModal
        orderId={selectedOrder}
        onClose={async () => {
          (setSelectedOrder(null), await fetchOrders());
        }}
        token={token!}
      />
    </div>
  );
}
