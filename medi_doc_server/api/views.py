from django.shortcuts import render

import os
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.conf import settings
from .models import Patient
import json
from openai import OpenAI
from textwrap import wrap
import logging
from dotenv import load_dotenv
from pydantic import BaseModel,ValidationError



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
            print(f"Saving data for {data['name']}...")
            return JsonResponse({'message': 'Details saved successfully.', 'file_name': file_name}, status=201)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
def list_patients(request):
    patients = Patient.objects.all()
    data = [{'id': patient.id, 'name': patient.name} for patient in patients]
    return JsonResponse(data, safe=False)

# def view_document(request):
#     try:
#         files = [file for file in os.listdir(DOCUMENT_FOLDER) if os.path.isfile(os.path.join(DOCUMENT_FOLDER, file))]
#         print(files)
#         return JsonResponse({'documents': files}, status=200)
       
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

def view_pdf(request, patient_id):
    patient = Patient.objects.get(id=patient_id)
    return FileResponse(open(patient.pdf_path, 'rb'), content_type='application/pdf')

# =====================================================================

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

    
    symptoms_lines = wrap(symptoms, 70)  # Adjust width (70) based on line length
    c.drawString(50, y_position, "Symptoms:")
    y_position -= line_spacing
    for line in symptoms_lines:
        c.drawString(70, y_position, line)
        y_position -= line_spacing

    
    diagnosis_lines = wrap(diagnosis, 70)  # Adjust width (70) based on line length
    c.drawString(50, y_position, "Diagnosis:")
    y_position -= line_spacing
    for line in diagnosis_lines:
        c.drawString(70, y_position, line)
        y_position -= line_spacing

    # Wrap and print Prescription
    prescription_lines = wrap(prescription, 70)  # Adjust width (70) based on line length
    c.drawString(50, y_position, "Prescription:")
    y_position -= line_spacing
    for line in prescription_lines:
        c.drawString(70, y_position, line)
        y_position -= line_spacing

    # Footer
    y_position -= 40
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, y_position, "Generated by MediDoc System")
    c.drawString(50, y_position - 10, f"File: {os.path.basename(file_path)}")

    c.save()


load_dotenv()


logger = logging.getLogger(__name__)

# @csrf_exempt
# def get_diagnosis(request):
#     if request.method == 'POST':
        
#         body = json.loads(request.body)
#         symptoms = body.get('symptoms', '')
#         client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
#         if not symptoms:
#             return JsonResponse({'error': 'Symptoms are required'}, status=400)

#         try:
#             completion = client.chat.completions.create(
#                  model="gpt-4o-mini",
#                  messages=[
#                       {"role": "system", "content": "Act like a docter"},
#                         {
#                           "role": "user",
#                           "content": f"What is the diagnosis for the following symptoms: {symptoms}?"
#                       }
#                 ]
# )
#             diagnosis = completion.choices[0].message.content
#             return JsonResponse({'diagnosis': diagnosis})

#         except Exception as e:
#             # Log the error to get more insights
#             logger.error(f"Error calling OpenAI API: {e}")
#             return JsonResponse({'error': str(e)}, status=500)

# ###############get prescription ############

# @csrf_exempt
# def get_prescription(request):
#     if request.method == 'POST':  # Change method check from 'GET' to 'POST'
#         try:
#             # Parse incoming JSON data
#             body = json.loads(request.body)
#             symptoms = body.get('symptoms', '')
#             diagnosis = body.get('diagnosis', '')
#             client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
#             # Validate input fields
#             if not symptoms or not diagnosis:
#                 return JsonResponse({'error': 'Symptoms and diagnosis are required.'}, status=400)

#             # Call OpenAI API to generate prescription
#             completion = client.chat.completions.create(
#                 model="gpt-4o-mini",
#                 messages=[
#                     {"role": "system", "content": "Act like docter"},
#                     {"role": "user", "content": f"Given the following details:\n\nSymptoms: {symptoms}\nDiagnosis: {diagnosis}\n\nSuggest an appropriate prescription including medications and instructions."}
#                 ],
#                 max_tokens=150
#             )

#             print(f"OpenAI Response: {completion}")  # Add this log to inspect the response

#             prescription = completion.choices[0].message.content
#             print("###########################################")
#             print(prescription)

#             # Return the generated prescription
#             return JsonResponse({'prescription': prescription})

#         except Exception as e:
#             # Log the error for better debugging
#             logger.error(f"Error calling OpenAI API: {e}")
#             return JsonResponse({'error': 'An error occurred while generating the prescription. Please try again later.'}, status=500)

#     return JsonResponse({'error': 'Invalid request method. Expected POST method.'}, status=405)

class AIResponseModel(BaseModel):
    diagnosis: str
    prescription: str

@csrf_exempt
def ask_ai(request):
    if request.method == 'POST':
        try:
            # Parse incoming JSON data
            body = json.loads(request.body)
            symptoms = body.get('symptoms', '')

            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

            # Validate input fields
            if not symptoms:
                return JsonResponse({'error': 'Symptoms are required.'}, status=400)

            # Call OpenAI API to generate both diagnosis and prescription
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an experienced doctor. When given symptoms, "
                            "provide both a diagnosis and a prescription. "
                            "Return them in a JSON format as follows:\n\n"
                            "{'diagnosis': '...', 'prescription': '...'}"
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Here are the symptoms: {symptoms}. Provide both a diagnosis and prescription."
                    },
                ],
                max_tokens=300
            )

            logger.info(f"OpenAI Response: {completion}")

            ai_response = completion.choices[0].message.content.strip()

            # Replace single quotes with double quotes for a valid JSON
            ai_response = ai_response.replace("'", '"')

            # Attempt to parse the response to ensure it's valid JSON
            try:
                ai_data = json.loads(ai_response)
                # Validate and parse with Pydantic
                structured_data = AIResponseModel(**ai_data)
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing AI response: {e}")
                return JsonResponse({'error': 'Failed to parse AI response. Please try again later.'}, status=500)
            except ValidationError as e:
                logger.error(f"Pydantic ValidationError: {e}")
                return JsonResponse({'error': 'Invalid data returned by AI. Please try again later.'}, status=500)

            # Return the validated data
            return JsonResponse(structured_data.dict())

        except Exception as e:
            # Log the error for better debugging
            logger.error(f"Error calling OpenAI API: {e}")
            return JsonResponse({'error': 'An error occurred while generating the response. Please try again later.'}, status=500)

    return JsonResponse({'error': 'Invalid request method. Expected POST method.'}, status=405)

@csrf_exempt
def delete_patient(request, patient_id):
    if request.method == 'DELETE':
        try:
            # Find the patient
            patient = Patient.objects.get(id=patient_id)
            
            # Construct the PDF file path
            pdf_file_name = f"{patient.name}_details.pdf"  # Update this pattern to match your file naming convention
            pdf_path = os.path.join(DOCUMENT_FOLDER, pdf_file_name)
            
            # Delete the patient record
            patient.delete()

            # Check if the file exists, then delete it
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            
            return JsonResponse({"message": "Patient deleted successfully"}, status=200)
        except Patient.DoesNotExist:
            return JsonResponse({"error": "Patient not found"}, status=404)
        except Exception as e:
            # Handle unexpected errors
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

def get_patient(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
        return JsonResponse({
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "symptoms": patient.symptoms,
        }, status=200)
    except Patient.DoesNotExist:
        return JsonResponse({"error": "Patient not found"}, status=404)

@csrf_exempt
def update_patient(request, patient_id):
    if request.method == 'PUT':
        try:
            patient = Patient.objects.get(id=patient_id)
            data = json.loads(request.body)
            

            # Store old patient details before update for PDF deletion
            old_pdf_path =patient.pdf_path

            # Update fields
            patient.name = data.get('name', patient.name)
            patient.age = data.get('age', patient.age)
            patient.symptoms = data.get('symptoms', patient.symptoms)
            patient.diagnosis = data.get('diagnosis',patient.diagnosis)
            patient.prescription = data.get('prescription',patient.prescription)
            
            patient.save()

            if old_pdf_path and os.path.exists(old_pdf_path):
                os.remove(old_pdf_path)

            # Generate a new PDF with updated details
            new_pdf_path = old_pdf_path
            create_pdf(new_pdf_path, patient.name, patient.age, patient.symptoms, patient.diagnosis, patient.prescription)

            # Update the patient's PDF path in the database
            patient.pdf_path = new_pdf_path
            patient.save()

            return JsonResponse({"message": "Patient updated successfully"}, status=200)
        except Patient.DoesNotExist:
            return JsonResponse({"error": "Patient not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)