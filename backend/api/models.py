from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, nit, usuario=None, direccion=None, email=None, password=None):
        if not nit:
            raise ValueError("Nit es requerido")

        user = self.model(nit=nit, usuario=usuario, direccion=direccion, email=email)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, nit, password=None):
        user = self.create_user(
            nit=nit,
            password=password,
        )

        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user
    

class Comercializadoras(models.Model):
    id = models.AutoField(primary_key=True)
    nic = models.CharField(unique=True, max_length=255, error_messages={'unique': "Ya existe una comercializadora con ese NIC. Por favor, elige uno diferente."})
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nic
    
class User(AbstractBaseUser):

    id = models.AutoField(primary_key=True)
    nit = models.CharField(unique=True, max_length=50, db_index=True)
    usuario = models.CharField(default=True, max_length=100, null=True)
    categoria = models.CharField(max_length=255, null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField( max_length=255, null=True, blank=True)
    comercializadora = models.ManyToManyField(Comercializadoras, related_name="comercializadora")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'nit'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.nit
    
    def has_perm(self, perm, obj=None):
        return True
    
    def has_module_perms(self, app_label):
        return True
    
    def delete(self, using=None, keep_parents=False):
        super().delete()

class Contrato(models.Model):
    id = models.AutoField(primary_key=True)
    nic = models.CharField(unique=True, max_length=255)
    direccion = models.CharField(max_length=255)
    nit = models.ForeignKey(User, on_delete=models.CASCADE, to_field="nit", blank=True)
    comercializadora = models.ManyToManyField(Comercializadoras, related_name="contratos", blank=True)


    def __str__(self):
        # return f"[{self.nit.usuario}] ({self.nic}) {self.direccion}"
        return self.nic


class UVT(models.Model):
    id = models.AutoField(primary_key=True)
    anho = models.CharField(max_length=20)
    valor = models.CharField(max_length=50)

    def __str__(self):
        return f"({self.anho}) {self.valor}"

class Tarifa(models.Model):
    id = models.AutoField(primary_key=True)
    tarifa = models.CharField(max_length=20)
    inicio = models.CharField(max_length=20)
    fin = models.CharField(max_length=20)
    categoria = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.tarifa}"
    

class Factura(models.Model):
    id = models.AutoField(primary_key=True)
    nic = models.ForeignKey(Contrato, on_delete=models.CASCADE, to_field="nic")
    anho = models.CharField(max_length=100)
    data = models.JSONField(default=dict)


    def __str__(self):
        return f"({self.anho}) [{self.nic}] {self.anho}"
    

