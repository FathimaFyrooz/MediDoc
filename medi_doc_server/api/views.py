from django.shortcuts import render

import os
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.conf import settings
from .models import Patient
import json


DOCUMENT_FOLDER = os.path.join(settings.MEDIA_ROOT, "pdf")
os.makedirs(DOCUMENT_FOLDER, exist_ok=True)

@csrf_exempt
def save_medical_details(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            data = json.loads(request.body)
            name = data.get('name')
            age = data.get('age')
            symptoms = data.get('symptoms')
            diagnosis = data.get('diagnosis')
            prescription = data.get('prescription')

            if not all([name, age, symptoms, diagnosis, prescription]):
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            
            file_name = f"{name}_details.pdf"
            file_path = os.path.join(DOCUMENT_FOLDER, file_name)

            
            create_pdf(file_path, name, age, symptoms, diagnosis, prescription)

            
            patient = Patient.objects.create(
                name=name,
                age=age,
                symptoms=symptoms,
                diagnosis=diagnosis,
                prescription=prescription, 
                pdf_path=file_path
            )

            return JsonResponse({'message': 'Details saved successfully.', 'file_name': file_name}, status=201)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
def list_patients(request):
    # Retrieve all patients from the database
    patients = Patient.objects.all().values('id', 'name') 
     # Adjust fields as needed
    print(patients)
    return JsonResponse(list(patients), safe=False)

def view_document(request):
    try:
        files = [file for file in os.listdir(DOCUMENT_FOLDER) if os.path.isfile(os.path.join(DOCUMENT_FOLDER, file))]
        print(files)
        return JsonResponse({'documents': files}, status=200)
       
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def view_pdf(request, patient_id):
    patient = Patient.objects.get(id=patient_id)
    return FileResponse(open(patient.pdf_path, 'rb'), content_type='application/pdf')


def create_pdf(file_path, name, age, symptoms, diagnosis, prescription):
    """Generate a structured PDF document with patient details."""
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, height - 50, "Medical Details Report")

    # Patient details
    c.setFont("Helvetica", 12)
    y_position = height - 100
    line_spacing = 20

    c.drawString(50, y_position, f"Name: {name}")
    y_position -= line_spacing
    c.drawString(50, y_position, f"Age: {age}")
    y_position -= line_spacing
    c.drawString(50, y_position, f"Symptoms: {symptoms}")
    y_position -= line_spacing
    c.drawString(50, y_position, f"Diagnosis: {diagnosis}")
    y_position -= line_spacing
    c.drawString(50, y_position, f"Prescription: {prescription}")

    # Footer
    y_position -= 40
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, y_position, "Generated by MediDoc System")
    c.drawString(50, y_position - 10, f"File: {os.path.basename(file_path)}")

    c.save()

