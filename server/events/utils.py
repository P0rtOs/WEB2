import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
from django.urls import reverse

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth
import os

FONT_PATH = os.path.join(os.path.dirname(__file__), "fonts", "DejaVuSans.ttf")
pdfmetrics.registerFont(TTFont("DejaVuSans", FONT_PATH))

def _wrap_text(text, fontname, fontsize, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = current + (" " if current else "") + word
        if stringWidth(test, fontname, fontsize) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines

def generate_ticket_pdf(registration):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    page_width, page_height = A4

    ticket_url = settings.FRONTEND_URL + f"/tickets/{registration.pk}/view"
    qr = qrcode.make(ticket_url)
    qr_io = BytesIO(); qr.save(qr_io, format="PNG"); qr_io.seek(0)
    img = ImageReader(qr_io)
    c.drawImage(img, 40, page_height - 240, width=200, height=200)

    x_text = 260
    y = page_height - 80
    title_font, title_size = "DejaVuSans", 16
    max_title_width = page_width - x_text - 40
    for line in _wrap_text(registration.event.title, title_font, title_size, max_title_width):
        c.setFont(title_font, title_size)
        c.drawString(x_text, y, line)
        y -= title_size + 4

    info_font, info_size = "DejaVuSans", 12
    for text in [
        f"Учасник: {registration.qr_holder_name}",
        f"Тариф: {registration.ticket_tier.title}",
        f"Ціна: {registration.ticket_tier.price} грн",
    ]:
        c.setFont(info_font, info_size)
        c.drawString(x_text, y, text)
        y -= info_size + 4

    y -= 200 
    desc_font, desc_size = "DejaVuSans", 10
    max_desc_width = page_width - 80
    text_obj = c.beginText(40, y)
    text_obj.setFont(desc_font, desc_size)
    for paragraph in registration.event.description.splitlines():
        for line in _wrap_text(paragraph, desc_font, desc_size, max_desc_width):
            text_obj.textLine(line)
    c.drawText(text_obj)

    c.setFont(desc_font, desc_size)
    c.drawString(40, 100, f"Квитанція №{registration.pk}")
    c.drawString(40, 80, f"Дата: {registration.registered_at.strftime('%Y-%m-%d %H:%M')}")

    c.showPage()
    c.save()
    buffer.seek(0)
    return ContentFile(buffer.read())
