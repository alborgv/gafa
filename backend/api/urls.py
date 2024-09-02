from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import *

urlpatterns = [
    path('users/', UserView.as_view(), name='users'),
    path('comercializadoras/', ComercializadorasView.as_view(), name='comercializadoras'),
    path('comercializadoras/create/', CreateComercializadoraView.as_view(), name='create_comercializadora'),
    path('comercializadoras/update/<int:pk>', UpdateComercializadoraView.as_view(), name='update_comercializadora'),
    path('comercializadoras/delete/<int:pk>', DeleteComercializadoraView.as_view(), name='delete_comercializadora'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('contratos/', ContratoView.as_view(), name='contrato'),
    path('factura/', FacturaView.as_view(), name='factura'),
    path('UVT/', UVTView.as_view(), name='UVT'),
    path('tarifa/', TarifaView.as_view(), name='Tarifa'),


    path('uploadComercializadora/', uploadComercializadora.as_view(), name='upload_comercializadoras'),
    path('exportExcel/', ExportToExcelAPIView.as_view(), name='export_excel'),

]