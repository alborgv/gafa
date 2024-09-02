from django.contrib import admin
from .models import User, Comercializadoras, Contrato, UVT, Tarifa, Factura

admin.site.register(User)
admin.site.register(Comercializadoras)
admin.site.register(Contrato)
admin.site.register(UVT)
admin.site.register(Tarifa)
admin.site.register(Factura)