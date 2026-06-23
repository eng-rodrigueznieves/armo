from rest_framework import serializers

from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "alt_text", "is_primary"]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        
        request = self.context("request")
        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)
        
        return image_url
    

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    dimensions = serializers.SerializerMethodField()

    recommended_space_label = serializers.CharField(
        source="get_recommended_space_display", read_only=True
    )
    recommended_style_label = serializers.CharField(
        source="get_recommended_style_display", read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "category",
            "description",
            "price",
            "inventory_quantity",
            "width",
            "depth",
            "height",
            "dimensions",
            "material",
            "color",
            "recommended_space",
            "recommended_space_label",
            "recommended_style",
            "recommended_style_label",
            "is_active",
            "primary_image",
            "images",
            "created_at",
            "updated_at",
        ]

    def get_dimensions(self, obj):
        return {
            "width": obj.width,
            "depth": obj.depth,
            "height": obj.height,
            "unit": "in",
        }
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()

        if primary_image is None:
            primary_image = obj.images.first()

        if primary_image is None:
            return None
        
        return ProductImageSerializer(primary_image, context=self.context).data