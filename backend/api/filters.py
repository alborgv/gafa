
import django_filters
from .models import User, Contrato, Factura

class UserFilter(django_filters.FilterSet):
    class Meta:
        model = User
        fields = {
            'nit': ['exact'],
        }


class ContratoFilter(django_filters.FilterSet):
    class Meta:
        model = Contrato
        fields = {
            'nit': ['exact'],
        }

class FacturaFilter(django_filters.FilterSet):
    nit = django_filters.CharFilter(field_name='nic__nit', lookup_expr='exact')
    anho = django_filters.NumberFilter(field_name='anho', lookup_expr='exact')
    nic = django_filters.CharFilter(field_name='nic', lookup_expr='exact')

    class Meta:
        model = Factura
        fields = ['nic', 'anho', 'nit']