from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Product
from .serializer import ProductSerializer


class ProductListAPIView(APIView):
    def get(self, request):
        products = Product.objects.filter(is_active=True).prefetch_related("images")
        search_query = request.query_params.get("q")
        category = request.query_params.get("category")
        recommended_space = request.query_params.get("space")
        recommended_style = request.query_params.get("style")

        if search_query:
            products = products.filter(
                Q(name__icontains=search_query)
                | Q(sku__icontains=search_query)
                | Q(category__icontains=search_query)
                | Q(material__icontains=search_query)
                | Q(color__icontains=search_query)
            )

        if category:
            products = products.filter(category__iexact=category)

        if recommended_space:
            products = products.filter(recommended_space=recommended_space)

        if recommended_style:
            products = products.filter(recommended_style=recommended_style)

        products = products.order_by("name")

        serializer = ProductSerializer(products, many=True, context={"request": request})

        return Response(
            {
                "count": products.count(),
                "results": serializer.data,
            }
        )
    

class ProductDetailAPIView(APIView):
    def get(self, request, product_id):
        product = get_object_or_404(
            Product.objects.filter(is_active=True).prefetch_related("images"),
            id=product_id,
        )

        serializer = ProductSerializer(product, context={"request": request})

        return Response(
            serializer.data
        )
