import React from 'react';
import { Product } from '@repo/api-client';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  storeId: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, storeId }) => {
  const navigate = useNavigate();
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.base_price;

  const handleAddToCart = () => {
    // TODO: Implementar lógica de agregar al carrito
    console.log('Agregar al carrito:', product.id);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {product.image_urls && product.image_urls[0] && (
        <CardMedia
          component="img"
          height="140"
          image={product.image_urls[0]}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        {product.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.base_price.toFixed(2)}
          </Typography>
          {hasDiscount && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${product.compare_at_price?.toFixed(2)}
            </Typography>
          )}
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button>
      </CardContent>
    </Card>
  );
}; 