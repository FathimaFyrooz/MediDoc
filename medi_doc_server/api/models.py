from django.db import models

class Patient(models.Model):
    name=models.CharField(max_length=100)
    age = models.IntegerField()
    symptoms = models.TextField()
    diagnosis = models.TextField()
    prescription = models.TextField()
    pdf_path = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

