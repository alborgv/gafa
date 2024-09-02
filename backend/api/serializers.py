from .models import User, Comercializadoras, Contrato, Factura, UVT, Tarifa

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    nombre_comercializadora = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'nit', 'usuario', 'categoria', 'direccion', 'email', 'comercializadora', 'nombre_comercializadora')

    def get_nombre_comercializadora(self, obj):
        return [comercializadora.nombre for comercializadora in obj.comercializadora.all()]


class ComercializadorasSerializer(serializers.ModelSerializer):
    usuarios = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Comercializadoras
        fields = ('id', 'nic', 'nombre', 'usuarios')


class ContratoSerializer(serializers.ModelSerializer):
    usuario = serializers.SerializerMethodField()
    categoria = serializers.SerializerMethodField()
    comercializadora = serializers.SerializerMethodField()

    class Meta:
        model = Contrato
        fields = ['id', 'usuario', 'nic', 'direccion', 'nit', 'categoria', 'comercializadora']

    
    def get_usuario(self, obj):
        return obj.nit.usuario
    
    def get_categoria(self, obj):
        return obj.nit.categoria

    def get_comercializadora(self, obj):

        comercializadora = obj.comercializadora.all()
        
        if not comercializadora.exists():
            return "SIN COMERCIALIZADORA"
        
        return comercializadora[0].nombre


class TokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['nit'] = user.nit
        token['usuario'] = user.usuario
        token['email'] = user.email
        # token['profile'] = "./src/assets/profile.jpg"

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('nit', 'usuario', 'direccion', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            nit=validated_data['nit'],
            usuario=validated_data['usuario'],
            direccion=validated_data['direccion'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

        
class FacturaSerializer(serializers.ModelSerializer):
    nit = serializers.SerializerMethodField()
    direccion = serializers.SerializerMethodField()
    
    class Meta:
        model = Factura
        fields = ('id', 'nit', 'nic', 'direccion', 'anho', 'data')

    def get_nit(self, obj):
        return obj.nic.nit_id

    def get_direccion(self, obj):
        return obj.nic.direccion
    
        
class UVTSerializer(serializers.ModelSerializer):
    class Meta:
        model = UVT
        fields = ('id', 'anho', 'valor')

        
class TarifaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarifa
        fields = ('id', 'tarifa', 'inicio', 'fin', 'categoria')