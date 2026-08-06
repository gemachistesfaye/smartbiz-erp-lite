import { ProductDetailPage } from '../components/product-detail';

interface ProductDetailPageWrapperProps {
  params: { productId: string };
}

export function ProductDetailPageWrapper({ params }: ProductDetailPageWrapperProps) {
  return <ProductDetailPage productId={params.productId} />;
}
