from django.db import models
from django.core.validators import MinValueValidator

class RecommendedSpace(models.TextChoices):
    PANTRY = "pantry", "Pantry"
    COFFEE_STATION = "coffee_station", "Coffee Station"
    LAUNDRY_ROOM = "laundry_room", "Laundry Room"
    REFRIGERATOR = "refrigerator", "Refrigerator"
    VANITY = "vanity", "Vanity"
    CLOSET = "closet", "Closet"
    CABINET = "cabinet", "Cabinet"
    OTHER = "other", "Other"


class RecommendedStyle(models.TextChoices):
    CLEAR_ACRYLIC = "clear_acrylic", "Clear Acrylic"
    BAMBOO_NATURAL = "bamboo_natural", "Bamboo / Natural"
    WHITE_MINIMAL = "white_minimal", "White Minimal"
    CREAM_NEUTRAL = "cream_neutral", "Cream Neutral"
    MIXED = "mixed", "Mixed"


class Product(models.Model):
    name = models.CharField(max_length=160)
    sku = models.CharField(max_length=80, unique=True)
    category = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    inventory_quantity = models.PositiveIntegerField(default=0)
    width = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)])
    depth = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)], help_text="Depth in inches")
    height = models.DecimalField(max_digits=7, decimal_places=2, validators=[MinValueValidator(0)], help_text="Height in inches")
    material = models.CharField(max_length=120)
    color = models.CharField(max_length=120)
    recommended_space = models.CharField(max_length=40, choices=RecommendedSpace.choices)
    recommended_style = models.CharField(max_length=40, choices=RecommendedStyle.choices)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["sku"]),
            models.Index(fields=["category"]),
            models.Index(fields=["recommended_space"]),
            models.Index(fields=["recommended_style"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"
    

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="product-images/%Y/%m/")
    alt_text = models.CharField(max_length=180, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_primary", "created_at"]

    def __str__(self):
        return f"Image for {self.product.name}"