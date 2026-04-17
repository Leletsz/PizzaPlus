import { apiClient } from "@/lib/api";
import { Items, Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { finishOrderAction } from "@/actions/orders";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  orderId: string | null;
  onClose: () => Promise<void>;
  token: string;
}

export function OrderModal({ orderId, onClose, token }: OrderModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = async () => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    try {
      setLoading(true);

      const response = await apiClient<Order>(
        `/order/detail?order_id=${orderId}`,
        {
          method: "GET",
          token: token,
        },
      );
      setOrder(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadOrders() {
      await fetchOrder();
    }
    loadOrders();
  }, [orderId]);

  const total =
    order?.items?.reduce(
      (acc: number, item: Items) => acc + item.amount * item.product.price,
      0,
    ) ?? 0;

  const handleFinishOrder = async () => {
    if (!orderId) return;
    const result = await finishOrderAction(orderId);
    const agree = confirm("Deseja finalizar o pedido?");

    if (result.error || !agree) {
      console.log(result.error);
      return;
    }

    if (result.success && agree) {
      router.refresh();
      onClose();
    }
  };

  return (
    <Dialog open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] bg-app-card text-white border border-app-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Detalhe do pedido
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Carregando...
          </p>
        ) : order ? (
          <div className="space-y-5">
            {/* Mesa e Cliente */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Nome da categoria
                </p>
                <p className="font-bold text-white">Mesa {order.table}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Cliente</p>
                <p className="font-bold text-white">{order.name ?? "—"}</p>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <span className="inline-block rounded-md bg-orange-950 px-3 py-1 text-sm font-bold text-orange-600">
                Em produção
              </span>
            </div>

            {/* Itens */}
            <div>
              <p className="font-bold text-white mb-3">Itens do pedido</p>
              <div className="space-y-4">
                {order.items?.map((item: Items) => {
                  const subtotal = item.amount * item.product.price;
                  return (
                    <div key={item.id}>
                      <p className="font-bold text-white">
                        {item.product.name}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {item.product.description}
                        </span>
                        <span className="text-white font-medium">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Quantidade: {item.amount}</span>
                        <span>Subtotal: {formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-app-border">
              <p className="font-bold text-2xl text-white">Total</p>
              <p className="text-2xl font-bold text-white">
                {formatPrice(total)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Não foi possível carregar o pedido.
          </p>
        )}

        <DialogFooter className="bg-app-card border-none">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 p-0.5 bg-transparent border-app-border text-white hover:bg-app-border/40 hover:text-white"
          >
            Fechar
          </Button>
          <Button
            className="flex-1 p-0.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold"
            disabled={loading}
            onClick={handleFinishOrder}
          >
            Finalizar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
