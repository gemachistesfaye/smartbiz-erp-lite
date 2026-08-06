import { useParams } from '@tanstack/react-router';
import { ProductDetailPage } from '../components/product-detail';

export function ProductDetailPageWrapper() {
  const { productId } = useParams({ strict: false });
  return <ProductDetailPage productId={productId as string} />;
}
