import csv
import io
import os
from flask import Flask, Response, jsonify, render_template, request, redirect, url_for, session ,flash
import pandas as pd
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash,generate_password_hash
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
import bcrypt 
import random
import datetime
from datetime import datetime, timedelta, date
import json
import random
import string
from itertools import groupby
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from elasticapm.contrib.flask import ElasticAPM
from flask_apscheduler import APScheduler
import socket

app = Flask(__name__)

app.config['ELASTIC_APM'] = {
 'SERVICE_NAME': 'airowiretool',
 'SECRET_TOKEN': 'amtapp',
 'SERVER_URL': 'https://10.10.100.49:8200',
 'ENVIRONMENT': 'my-environment',
 'VERIFY_SERVER_CERT': True,
 'SERVER_CERT': 'fleet.crt',
 'LOG_LEVEL': 'debug',
 'DEBUG': True,
 }

apm = ElasticAPM(app)

app.secret_key = 'xyzsdfg'

app.config['MYSQL_HOST'] = '10.102.145.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Airowire@1234'  #Airowire@1234
app.config['MYSQL_DB'] = 'amt'

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

mysql = MySQL(app)


#Login,Register,Logout Basic operations
class Config:
    SCHEDULER_API_ENABLED = True

app.config.from_object(Config())
scheduler = APScheduler()
scheduler.init_app(app)

@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    message = ''
    if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
        email = request.form['email']
        password = request.form['password']

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM user WHERE email = %s and status ="approved"', (email,))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['loggedin'] = True
            session['id'] = user['id']
            session['uname'] = user['uname']
            session['email'] = user['email']
            session['type'] = user['type']
            session['tname'] = user['tname']
            return redirect(url_for('dashboard'))
        else:
            message = 'Please enter correct email / password! or account has not approved'
    
    return render_template('login.html', message=message)

@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('email', None)
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'loggedin' in session:
        cur = mysql.connection.cursor()
        cur.execute("SELECT count(*) as total_user FROM user where tname='project' ")
        puser = cur.fetchone()
        cur.execute("SELECT count(*) as total_user FROM user where tname='project' and status='Not_Approved' ")
        papen = cur.fetchone()
        cur.execute("SELECT count(*) as total_user FROM payout_details p inner join user u on p.name=u.uname  where u.tname='project' and p.status='Pending with PM' ")
        paapen = cur.fetchone()
        cur.execute('SELECT count(DISTINCT(name)) as name FROM pms')
        pmsname = cur.fetchone()
        cur.execute("SELECT count(*) as total_user FROM user WHERE tname='project'")
        total_user_count = cur.fetchone()[0]
        cur.execute("SELECT tname, COUNT(*) as user_count FROM user GROUP BY tname")
        team_data = cur.fetchall()
        name = session.get('uname')
        cur.execute("SELECT material, COUNT(*) AS pending_count FROM lab WHERE status = 'Pending with manager' and name=%s GROUP BY material",(name,))
        pending_material = cur.fetchall()
        emai = session.get('email')
        cur.execute("SELECT material, COUNT(*) AS pending_count FROM elab WHERE status = 'Pending with manager' and remail=%s GROUP BY material",(emai,))
        pending_material_demo = cur.fetchall()
        cur.execute("SELECT COUNT(*) as lab_count FROM lab WHERE name=%s ",(name,))
        ilab = cur.fetchone()
        cur.execute("SELECT COUNT(*) as lab_count FROM elab WHERE remail=%s ",(name,))
        elab = cur.fetchone()
        uname = session.get('uname')
        cur.execute("SELECT COUNT(*) as lab_count FROM payout_details WHERE name=%s ",(uname,))
        cpa = cur.fetchone()
        cur.execute("SELECT COUNT(*) AS labcount FROM lab WHERE name=%s AND status in ('approved','return initiated')",(name,))
        lab_count = cur.fetchone()
        cur.execute("SELECT COUNT(*) AS democount FROM elab WHERE remail=%s AND status in ('approved','return initiated')",(name,))
        demo_count = cur.fetchone()
        final_count_device = lab_count[0] + demo_count[0]

        cur.close()
        return render_template('dashboard.html',puser=puser,papen=papen,paapen=paapen,pmsname=pmsname,total_user_count=total_user_count,team_data=team_data,pending_material = pending_material,ilab=ilab,elab=elab,cpa=cpa,final_count_device=final_count_device,pending_material_demo=pending_material_demo)
    
    return redirect(url_for('login'))


@app.route('/certification_tracker', methods=['GET', 'POST'])
def certification_tracker():
    if 'loggedin' in session:
            cur = mysql.connection.cursor()
            cur.execute("SELECT name,cname FROM certification WHERE type='associate' AND status='completed'")
            aemp = cur.fetchall()
            cur.execute("SELECT name,cname FROM certification WHERE type='professional' AND status='completed' ")
            pemp = cur.fetchall()
            cur.execute("SELECT name,cname FROM certification WHERE type='expert' AND status='completed'")
            eemp = cur.fetchall()
            session['aemp'] = aemp
            session['pemp'] = pemp
            session['eemp'] = eemp
            cur.execute("SELECT count(*) as total_certs FROM certification where type='associate' and status='completed' ")
            acert = cur.fetchone()
            cur.execute("SELECT count(*) as total_certs FROM certification where type='professional' and status='completed' ")
            pcert = cur.fetchone()
            cur.execute("SELECT count(*) as total_certs FROM certification where type='expert' and status='completed' ")
            ecert = cur.fetchone()
            cur.execute("SELECT c.cname, o.OEM, COUNT(*) as count_certifications FROM certification c INNER JOIN oem_cert o ON c.cname = o.cname WHERE c.status = 'completed' AND o.OEM='Aruba' GROUP BY c.cname, o.OEM")
            results = cur.fetchall()
            cur.execute("SELECT c.cname, o.OEM, COUNT(*) as count_certifications FROM certification c INNER JOIN oem_cert o ON c.cname = o.cname WHERE c.status = 'completed' AND o.OEM='Fortinet' GROUP BY c.cname, o.OEM")
            results1 = cur.fetchall()
            cur.execute("SELECT c.cname, o.OEM, COUNT(*) as count_certifications FROM certification c INNER JOIN oem_cert o ON c.cname = o.cname WHERE c.status = 'completed' AND o.OEM='Cloudflare' GROUP BY c.cname, o.OEM")
            results2 = cur.fetchall()
            cur.close()
            chart_data = []
            for row in results:
                chart_data.append({'cname': row[0], 'count_certifications': row[2]})
            chart_data1 = []
            for row in results1:
                chart_data1.append({'cname': row[0], 'count_certifications': row[2]})
            chart_data2 = []
            for row in results2:
                chart_data2.append({'cname': row[0], 'count_certifications': row[2]})
            
            return render_template('certification_tracker.html', acert=acert, pcert=pcert, ecert=ecert, aemp=aemp,pemp=pemp,eemp=eemp,chart_data=chart_data,chart_data1=chart_data1,chart_data2=chart_data2)

    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    message = ''
    if request.method == 'POST' and 'uname' in request.form and 'password' in request.form and 'email' in request.form and 'repassword' in request.form and 'tname' in request.form and 'designation' in request.form:
        uname = request.form['uname']
        password = request.form['password']
        email = request.form['email']
        repassword = request.form['repassword']
        tname = request.form['tname']
        designation = request.form['designation']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM user WHERE email = %s', (email,))
        account = cursor.fetchone()
        if account:
            message = 'Account already exists !'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            message = 'Invalid email address !'
        elif password != repassword:
            message = 'Password did not match'
        elif not uname or not password or not email or not repassword or not tname or not designation:
            message = 'Please fill out the form !'
        else:
            cursor.execute('INSERT INTO user VALUES (NULL, %s, %s, %s,%s,%s,%s,%s)', (uname,hashed_password,'user',tname,designation,'Not_Approved',email))
            mysql.connection.commit()
            message = 'You have successfully registered!'
            return redirect(url_for('login'))
    elif request.method == 'POST':
        message = 'Please fill out the form !'
    return render_template('register.html', message=message)



#user payout list

@app.route('/payout')
def payout():
    message = ''
    name = session.get('uname') 
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM payout_details WHERE name = %s ORDER BY id desc', (name,))
    data = cur.fetchall()
    cur.execute("SELECT DISTINCT startdate FROM payout_details WHERE name=%s",(name,))
    dates = [date[0].strftime("%Y-%m-%d") for date in cur.fetchall()]
    if 'loggedin' in session:
        return render_template('payout.html', data=data,dates=dates)
    return redirect('/login')



@app.route('/upcoming_certificate')
def upcoming_certificate():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute('SELECT uname FROM user')
    user = cur.fetchall()
    cur.execute('SELECT cname FROM oem_cert')
    cname = cur.fetchall()
    cur.execute('SELECT * FROM certification  order by id desc')
    data = cur.fetchall()
    id = request.args.get('id')
    if id is not None:
        cur.execute("SELECT * FROM  certification WHERE id = %s", (id,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        return jsonify({
            'name': mdata[1],
            'cname': mdata[2],
            'asdate' : mdata[3],
            'tdate' : mdata[4],
            'type': mdata[5],
            'status' : mdata[6],
            'adate': mdata[7],
            'edate' : mdata[8],
            'reason' : mdata[9]
        })
    cur.close()
    if 'loggedin' in session:
        return render_template('upcoming_certificate.html', data=data,user=user,cname=cname)
    return redirect('/login')


@app.route('/ecomplete', methods=['POST'])
def ecomplete():
    if request.method == "POST":
        cur = mysql.connection.cursor()
        id = request.form['id']
        edate = request.form['edate']
        adate = request.form['adate']
        
        edate_mysql = datetime.strptime(edate, '%Y-%m-%d').date()
        adate_mysql = datetime.strptime(adate, '%Y-%m-%d').date()
        
        cur.execute("UPDATE certification SET status = 'completed', edate = STR_TO_DATE(%s, '%%Y-%%m-%%d'), adate = STR_TO_DATE(%s, '%%Y-%%m-%%d') WHERE id = %s", (edate_mysql, adate_mysql, id))
        
        mysql.connection.commit()
        
        cur.execute("SELECT * FROM certification WHERE id = %s", (id,))
        exam = cur.fetchone()
        
        examc_email(exam)
        
        cur.close()
        
        return """
            <script>
                alert("Exam completed and email notification sent.");
                window.location.href = "/upcoming_certificate";
            </script>
        """
    else:
        return "Issues in submitting"

def bsend_email(exam):
    name = exam[1]
    cname = exam[2]
    type = exam[5]
    bedate = exam[10]
    bextime = exam[11]
    cost = exam[15]
    uemail = exam[23]
    sender_email = "amtairowire@gmail.com"
    receiver_emails = ["yogesh@airowire.com"]
    subject = "Certification Exam || Booking"
    body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <p>Hi Team,<p>

        <p> Kindly find the below details of certification exam to be booked.</p><br>
        <table style="border: 1px solid black;text-align: center" border="2">
            <thead style="background-color: black;color: white">
                <tr>
                    <th>Employee Name</th>
                    <th>Certificate Name</th>
                    <th> Type </th>
                    <th>Booking Exam Date</th>
                    <th> Exam Cost </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{name}</td>
                    <td>{cname}</td>
                    <td>{type}</td>
                    <td>{bedate}</td>
                    <td> {cost} </td>
                </tr>
            </tbody>
        </table>
        <p>Thanks and Regards,<br>AMT Team </p>

    </body>
    </html>
    """

    # SMTP server configuration
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "amtairowire@gmail.com"
    smtp_password = "cootssnoqqaozhyv"

    # DNS resolution check
    try:
        ip = socket.gethostbyname(smtp_server)
        print(f"DNS resolution for {smtp_server} succeeded: {ip}")
    except socket.gaierror as e:
        print(f"DNS resolution failed: {e}")
        # Log the error and return
        return f"DNS resolution failed: {e}"

    # Create a MIME multipart message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = ", ".join(receiver_emails)
    message["Subject"] = subject

    message.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(sender_email, receiver_emails, message.as_string())
        print("Email sent successfully.")
        return "Email sent successfully"
    except Exception as e:
        print(f"Failed to send email: {e}")
        # Log the error and return
        return f"Failed to send email: {e}"


@app.route('/bookexam', methods=['GET','POST'])
def bookexam():
    if request.method == "POST":
        id = request.form['id']
        bedate = request.form['bedate']
        bextime = request.form['bextime']
        cur = mysql.connection.cursor()
        cur.execute("UPDATE certification SET status = 'In Progress',bedate=%s,bextime=%s WHERE id = %s", (bedate,bextime,id))
        mysql.connection.commit()
        cur.execute("SELECT * FROM certification c INNER JOIN oem_cert o ON c.cname=o.cname INNER JOIN user u on c.name=u.uname WHERE c.id=%s", (id,))
        exam = cur.fetchone()
        bsend_email(exam)
        cur.close()
        return """
            <script>
                alert("Email has been sent to book the exam");
                window.location.href = "/upcoming_certificate";
            </script>
            """
    else:
         return """
            <script>
                alert("Check with amt administrator");
                window.location.href = "/upcoming_certificate";
            </script>
            """


def read_html_file(file_path):
    with open(file_path, "r") as file:
        html_content = file.read()
    return html_content

def examc_email(exam):
    exam_ename = exam[1]
    exam_cname = exam[2]
    sender_email = "amtairowire@gmail.com"
    receiver_emails = ["yogesh@airowire.com"]
    subject = f"{exam_ename},Congratulation On Completing :  {exam_cname}"
    html_content = read_html_file("templates/email_template.html")
    html_content = html_content.replace("{{ sender_name }}", exam_ename)
    html_content = html_content.replace("{{ exam_cname }}", exam_cname)
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "amtairowire@gmail.com"
    smtp_password = "cootssnoqqaozhyv"

    # Create a MIME multipart message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = ", ".join(receiver_emails)
    message["Subject"] = subject
    html_body = MIMEText(html_content, "html")  # Set the content type to HTML
    message.attach(html_body)
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_emails, message.as_string())



@app.route('/tcertd')
def tcertd():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM certification where status="completed" order by id desc')
    data = cur.fetchall()

    # Calculate the date threshold (20 days from today)
    threshold_date = datetime.now().date()

    # Add a new field to the data to store updated dates
    updated_data = []
    for row in data:
        edate = row[8]  # Assuming edate is in row[5]
        if edate is not None:
            updated_date = edate - timedelta(days=20)
            row = list(row)  # Convert tuple to list to modify
            row.append(updated_date)
            updated_data.append(row)

    cur.close()
    if 'loggedin' in session:
        return render_template('tcertd.html', data=updated_data, threshold_date=threshold_date)
    return redirect('/login')
#admin KRA template list

@app.route('/admin/kratemplate')
def kratemplate():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM kra_template ORDER BY id desc')
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/kratemplate.html', data=data)
    return redirect('/login')



@app.route('/admin/tkraadd', methods=['GET', 'POST'])
def tkraadd():
    if request.method == 'POST' and 'template_name' in request.form:
        template_name = request.form['template_name']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO kra_template (template_name) VALUES (%s)', (template_name,))
        mysql.connection.commit()
        return redirect('/admin/kratemplate')
    return redirect('/admin/kratemplate')


@app.route('/admin/kratemplatedata')
def kratemplatedata():
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM kra_template_data order by id desc')
    data = cur.fetchall()
    cur.execute('SELECT * FROM kra_template ORDER BY id desc')
    select_data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/kratemplatedata.html', data=data,select_data=select_data)
    return redirect('/login')

@app.route('/admin/dkraadd', methods=['GET', 'POST'])
def dkraadd():
    if request.method == 'POST' and 'template_name' in request.form and 'kra_item' in request.form:
        template_name = request.form['template_name']
        kra_item = request.form['kra_item']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO kra_template_data (template_name,kra_item) VALUES (%s,%s)', (template_name,kra_item,))
        mysql.connection.commit()
        return redirect('/admin/kratemplatedata')
    return redirect('/admin/kratemplatedata')


@app.route('/pmsassign',methods=['POST','GET'])
def pmsassign():
    if request.method == 'POST':
        name= request.form['name']
        currentYear = str(datetime.now().year)
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM pms where year=%s AND name=%s   ',(currentYear,name,))
        sdata = cur.fetchall()
        cur.execute('SELECT SUM(Weigtage)  AS sum,name FROM pms WHERE KRA != "Comments" AND name = %s',(name,))
        sumn = cur.fetchall()
        cur = mysql.connection.cursor()
        cur.execute(' SELECT DISTINCT u.uname FROM user u LEFT JOIN pms p ON u.uname = p.name WHERE u.tname = "project" AND p.name IS NULL ')
        select_data = cur.fetchall()
        cur.execute('SELECT DISTINCT template_name FROM kra_template_data where template_name!="template_name"')
        template_name = cur.fetchall()
        cur.execute('SELECT DISTINCT name FROM pms')
        name = cur.fetchall()
        return render_template('pmsassign.html',sdata=sdata,select_data=select_data,template_name=template_name,name=name,sumn=sumn)
    currentYear = str(datetime.now().year)
    cur = mysql.connection.cursor()
    cur.execute('SELECT DISTINCT u.uname FROM user u LEFT JOIN pms p ON u.uname = p.name WHERE u.tname = "project" AND p.name IS NULL')
    select_data = cur.fetchall()
    cur.execute('SELECT DISTINCT template_name FROM kra_template_data where template_name!="template_name"')
    template_name = cur.fetchall()
    cur.execute('SELECT * FROM pms where year=%s and name="suraj"  ',(currentYear,))
    rows = cur.fetchall()
    cur.execute('SELECT SUM(Weigtage) AS sum FROM pms WHERE KRA != "Comments" AND name = "suraj" ')
    sumn = cur.fetchall()
    cur.execute('SELECT DISTINCT name FROM pms')
    name = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('pmsassign.html',select_data=select_data,template_name=template_name,rows=rows,name=name,sumn=sumn)
    return redirect('/login')


@app.route('/pmsadd', methods=['POST','GET'])
def pmsadd():
    if request.method == 'POST':
        name = request.form['name']
        template_name = request.form['template_name']

        
        cur = mysql.connection.cursor()
        cur.execute("SELECT kra_item FROM kra_template_data WHERE template_name = %s", (template_name,))
        kra_values = cur.fetchall()
        cur.close()

        if kra_values:
            
            sql = "INSERT INTO pms (name, KRA, Weigtage, Jan, Feb, Mar, April, May, June, July, Aug, Sept, Oct, Nov, Dece, year) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

           
            current_year_abbrev = str(datetime.datetime.now().year)

           
            for kra_value in kra_values:
                
                values = (name, kra_value[0], "", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", "NA", current_year_abbrev)
                cur = mysql.connection.cursor()
                cur.execute(sql, values)
                cur.close()

           
            mysql.connection.commit()
            
            return redirect('/pmsassign')  
        else:
            return "No KRA values found for the template name"
        
    return redirect('/pmsassign')  



@app.route('/pms_edit', methods=['GET', 'POST'])
def pms_edit():
    if request.method == 'POST':
        
        id = request.args.get('id')
        name = request.form['name']
        KRA = request.form['KRA']
        Weightage = request.form['Weightage']
        month = request.form['month']
        remarks = request.form['remarks']
        year = request.form['year']
        ide = request.form['ide']
        Jan = ""
        Feb = ""
        Mar = ""        
        April = ""
        May = ""
        June = ""
        July = ""
        Aug = ""
        Sept = ""
        Oct = ""
        Nov = ""
        Dece = ""
        Jan = request.form['Jan']
        Feb = request.form['Feb']
        Mar = request.form['Mar']
        April = request.form['April']
        May = request.form['May']
        June = request.form['June']
        July = request.form['July']
        Aug = request.form['Aug']
        Sept = request.form['Sept']
        Oct = request.form['Oct']
        Nov = request.form['Nov']
        Dece = request.form['Dece']
        if month == "Jan":
            Jan = remarks
        elif month == "Feb":
            Feb = remarks
        elif month == "Mar":
            Mar = remarks
        elif month == "April":
            April = remarks
        elif month == "May":
            May = remarks
        elif month == "June":
            June = remarks
        elif month == "July":
            July = remarks
        elif month == "Aug":
            Aug = remarks
        elif month == "Sept":
            Sept = remarks
        elif month == "Oct":
            Oct = remarks
        elif month == "Nov":
            Nov = remarks
        elif month == "Dece":
            Dece = remarks
        else:
            month =""
        cur = mysql.connection.cursor()
        try:
            cur.execute("UPDATE pms SET name=%s, KRA=%s, Weigtage=%s,Jan=%s,Feb=%s,Mar=%s,April=%s,May=%s,June=%s,July=%s,Aug=%s,Sept=%s,Oct=%s,Nov=%s,Dece=%s,year=%s WHERE id=%s", (name, KRA, Weightage,Jan,Feb,Mar,April,May,June,July,Aug,Sept,Oct,Nov,Dece,year, ide))
            mysql.connection.commit()
            flash('PMS record updated successfully', 'success')
        except Exception as e:
            mysql.connection.rollback()
            flash(f'Error updating PMS record: {str(e)}', 'danger')
        finally:
            cur.close()
        
        return redirect(url_for('pmsedit', name=name))
    else:
        
        cur = mysql.connection.cursor()
        id = request.args.get('id')
        cur.execute("SELECT * FROM pms WHERE id=%s", (id,))
        data = cur.fetchone()
        cur.close()
        return render_template('pms_edit.html', row=data,id=id)
    
@app.route('/pmsedit',methods=['GET','POST'])
def pmsedit():
    name = request.args.get('name')
    currentYear = str(datetime.datetime.now().year)
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM pms where year=%s AND name=%s  ',(currentYear,name,))
    ndata = cur.fetchall()
    cur.execute('SELECT SUM(Weigtage)  AS sum,name FROM pms WHERE KRA != "Comments" AND name = %s',(name,))
    sumn = cur.fetchall()
    return render_template('pmsedit.html',ndata=ndata,sumn=sumn)


@app.route('/payoutadd',methods=['GET', 'POST'])
def payoutadd():
    if request.method == 'POST' and 'date' in request.form and 'remarks' in request.form \
            and 'start_time' in request.form and 'end_time' in request.form:
        date = request.form['date']
        enddate = request.form['enddate']
        remarks = request.form['remarks']
        start_time = request.form['start_time']
        end_time = request.form['end_time']
        name = session.get('uname')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO payout_details VALUES (NULL, %s,%s, %s, %s, %s, %s, %s,NULL)',
                       (name, date,enddate, remarks, 'Pending with PM', start_time, end_time))
        mysql.connection.commit()
        message = 'Payout added successfully'
        return redirect('/payout')
    return redirect('/payout')



@app.route('/ceadd',methods=['GET', 'POST'])
def ceadd():
    if request.method == 'POST':
        name = request.form['name']
        cname = request.form['cname']
        adate = request.form['adate']
        tdate = request.form['tdate']
        type = request.form['type']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO certification (name,cname,assigned_date,target_date,type) VALUES (%s,%s, %s, %s, %s)',
                       (name, cname,adate,tdate,type))
        mysql.connection.commit()
        return redirect('/upcoming_certificate')
    return redirect('/upcoming_certificate')

@app.route('/lab', methods=['GET', 'POST'])
def lab():
    message = ''
    name = session.get('uname') 
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM lab l inner join user u on l.name=u.uname  WHERE name = %s ORDER BY l.id desc', (name,))
    data = cur.fetchall()
    cur.execute('SELECT * FROM inventory')
    inventoryname = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[12]):
        grouped_data[key] = list(group)
    if request.method == "POST":
        material = request.form['material']
        cur = mysql.connection.cursor()
        cur.execute('SELECT Qty FROM inventory WHERE Description = %s', (material,))
        qt = cur.fetchone()
        cur.close()
        if qt:
            # Return quantity as JSON response
            return jsonify({'quantity': qt[0]})
        else:
            # Return quantity as null if not found
            return jsonify({'quantity': None})
    mid = request.args.get('mid')
    if mid is not None:
        cur.execute("SELECT * FROM lab WHERE id = %s", (mid,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        material = mdata[3]
        print(material)
        cur.execute("SELECT SerialNo FROM inventory WHERE Description = %s", (material,))
        inventory_serial_numbers = [serial.strip() for row in cur.fetchall() for serial in row[0].split(',')]
        print(inventory_serial_numbers)
        elab_serial_numbers = [serial.strip() for serial in mdata[11].split(',')]
        print(elab_serial_numbers)
        matching_serial_numbers = [serial for serial in elab_serial_numbers if serial in inventory_serial_numbers]
        print(matching_serial_numbers)
        return jsonify({
            'ticket_no': mdata[12],
            'name': mdata[1],
            'material': mdata[3],
            'Part_Number' : mdata[10],
            'status': mdata[8],
            'serial_number' : matching_serial_numbers
        })
    if 'loggedin' in session:
        return render_template('lab.html', grouped_data=grouped_data, inventoryname=inventoryname)
    return redirect('/login')


@app.route('/rlab')
def rlab():
    message = ''
    name = session.get('uname') 
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM lab l inner join user u on l.name=u.uname  WHERE u.uname = %s and l.status in ("approved","return initiated") ORDER BY l.id desc', (name,))
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[12]):
        grouped_data[key] = list(group)
    cur.execute('SELECT * FROM inventory')
    inventoryname = cur.fetchall()
    cur.close()

    if 'loggedin' in session:
        return render_template('rlab.html', grouped_data=grouped_data, inventoryname=inventoryname)
    return redirect('/login')


@app.route('/relab')
def relab():
    message = ''
    name = session.get('email')
    cur = mysql.connection.cursor()
    cur.execute(' SELECT * FROM elab l inner join user u on l.remail=u.email  WHERE l.remail = %s and l.status in ("approved","return initiated") ORDER BY l.id desc ', (name,))
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    cur.execute('SELECT * FROM inventory')
    inventoryname = cur.fetchall()
    cur.close()

    if 'loggedin' in session:
        return render_template('relab.html', grouped_data=grouped_data, inventoryname=inventoryname)
    return redirect('/login')

@app.route('/orelab')
def orelab():
    message = ''
    name = session.get('email')
    cur = mysql.connection.cursor()
    cur.execute(' SELECT * FROM elab   WHERE  status in ("approved","return initiated") ORDER BY id desc')
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    cur.execute('SELECT * FROM inventory')
    inventoryname = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('orelab.html', grouped_data=grouped_data, inventoryname=inventoryname)
    return redirect('/login')



@app.route('/lapprove')
def lapprove():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM lab l inner join user u on l.name=u.uname  order by l.id desc')
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[12]):
        grouped_data[key] = list(group)
    id = request.args.get('id')
    if id is not None:
        cur.execute("SELECT * FROM lab WHERE id = %s", (id,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        material = mdata[3]
        print(material)
        cur.execute("SELECT SerialNo FROM inventory WHERE Description = %s", (material,))
        inventory_serial_numbers = [serial.strip() for row in cur.fetchall() for serial in row[0].split(',')]
        print(inventory_serial_numbers)
        lab_serial_numbers = [serial.strip() for serial in mdata[11].split(',')]
        print(lab_serial_numbers)
        matching_serial_numbers = [serial for serial in lab_serial_numbers if serial in inventory_serial_numbers]
        print(matching_serial_numbers)
        return jsonify({
            'ticket_no': mdata[12],
            'name': mdata[1],
            'material': mdata[3],
            'Part_Number' : mdata[10],
            'status': mdata[7],
            'serial_number' : matching_serial_numbers
        })
    cur.close()
    if 'loggedin' in session:
        return render_template('lapprove.html',grouped_data=grouped_data)
    return redirect('/login')  


@app.route('/labadd',methods=['GET', 'POST'])
def labadd():
    if request.method == 'POST':
        purpose = request.form['purpose']
        material = request.form['material']
        quantity = request.form['quantity']
        start_date = request.form['start_date']
        pname = request.form['pname']
        end_date = request.form['end_date']
        name = session.get('uname')
        cur= mysql.connection.cursor()
        cur.execute("SELECT Part_No FROM inventory where Description=%s",(material,))
        part_data=cur.fetchone()
        partnumber = part_data[0]
        prefix = 'ANPL-'
        ticket_number = generate_ticket_number(prefix)
        generated_ticket_numbers.append(ticket_number)
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO lab (name, purpose ,material, quantity, start_date, end_date, status,pname,Part_No,tno) VALUES (%s,  %s,%s,%s, %s, %s, %s, %s,%s,%s)',
               (name, purpose,  material, quantity, start_date, end_date, 'Pending with manager',pname,partnumber,ticket_number))
        mysql.connection.commit()
        message = 'Payout added successfully'
        return redirect('/lab')
    return redirect('/lab')

@app.route('/pmsremove',methods=['POST','GET'])
def pmsremove():
    if 'loggedin' in session:
        if request.method == 'POST':
            name = request.form['name']
            cur = mysql.connection.cursor()
            cur.execute("DELETE FROM pms WHERE name = %s", (name,))
            mysql.connection.commit()
            cur.close()
            return redirect('/pmsassign')
        return redirect('/pmsassign')
    return redirect('/login')



@app.route('/labapprove', methods=['POST', 'GET'])
def labapprove():
    if 'loggedin' in session:
        if request.method == 'POST':
            final_status = 'approved'
            tno = request.form['tno']
            selected_serial_numbers = request.form.getlist('serialNumber')
            # Fetch the IDs associated with the given tno
            cur = mysql.connection.cursor()
            cur.execute("SELECT id FROM elab WHERE tno = %s", (tno,))
            ids = [row[0] for row in cur.fetchall()]
            materials = []
            lab_quantities = []

            # Update the serial numbers for each ID
            for id in zip(ids):
                # Fetch existing material and quantity
                cur.execute("SELECT material, Qty FROM elab WHERE id = %s", (id,))
                material, quantity = cur.fetchone()
                materials.append(material)
                lab_quantities.append(quantity)

                # Update the database with the new serial numbers
                cur.execute("UPDATE elab SET status = %s, serialNumber = %s WHERE id = %s", (final_status,  ", ".join(selected_serial_numbers), id))

                # Fetch the current quantity from the inventory
                cur.execute("SELECT Qty FROM inventory WHERE Description = %s", (material,))
                current_qty = cur.fetchone()[0]

                # Calculate the new quantity after subtraction
                new_qty = current_qty - quantity

                # Update the inventory quantity
                cur.execute("UPDATE inventory SET Qty = %s WHERE Description = %s", (new_qty, material))

            # Commit changes and close the cursor
            mysql.connection.commit()
            cur.close()

            return redirect('/elapprove')
    return redirect('/login')


@app.route('/labapproveadd', methods=['POST', 'GET'])
def labapproveadd():
    if 'loggedin' in session:
        if request.method != 'POST':
            final_status = 'returned approved'
            tno = request.args.get('tno')
            cur = mysql.connection.cursor()
            cur.execute("SELECT id FROM elab WHERE tno = %s", (tno,))
            ids = [row[0] for row in cur.fetchall()]
            materials = []
            lab_quantities = []

            # Update the serial numbers for each ID
            for id in zip(ids):
                # Fetch existing material and quantity
                cur.execute("SELECT material, Qty FROM elab WHERE id = %s", (id,))
                material, quantity = cur.fetchone()
                materials.append(material)
                lab_quantities.append(quantity)

                # Update the database with the new serial numbers
                cur.execute("UPDATE elab SET status = %s WHERE id = %s", (final_status, id)) 
                # Fetch the current quantity from the inventory
                cur.execute("SELECT Qty FROM inventory WHERE Description = %s", (material,))
                current_qty = cur.fetchone()[0]

                # Calculate the new quantity after subtraction
                new_qty = current_qty + quantity

                # Update the inventory quantity
                cur.execute("UPDATE inventory SET Qty = %s WHERE Description = %s", (new_qty, material))

            # Commit changes and close the cursor
            mysql.connection.commit()
            cur.close()

            return redirect('/elapprove')
        return redirect('/elapprove')
    return redirect('/login')

@app.route('/multidemo', methods=['POST', 'GET'])
def multidemo():
    if 'loggedin' in session: 
        if request.method == 'POST':
            cname = request.form['cname']
            cpocname = request.form['cpocname']
            cphone = request.form['cphone']
            cemail = request.form['cemail']
            sdate = request.form['sdate']
            edate = request.form['edate']
            remail = request.form['remail']
            prefix = 'ANPL-'
            ticket_number = generate_ticket_number(prefix)
            generated_ticket_numbers.append(ticket_number)
            materials_json = request.form['materials']
            quantities = request.form.getlist('quantities')
        # Parse JSON data into Python lists
            materials = json.loads(materials_json)
            materials = [material for material in materials if material is not None]
            print("Received materials:", materials)
            print("Received quantities:", quantities)
            cur = mysql.connection.cursor()
            insert_material_query = "INSERT INTO elab (cname, cpocname, cphone, cemail, sdate, edate, remail, material,Part_No, status,Qty,tno) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s,%s)"
            for material, quantity in zip(materials, quantities):
                cur.execute("SELECT Part_No FROM inventory where Description=%s",(material,))
                part_data=cur.fetchone()
                partnumber = part_data[0]
                material_data = (cname, cpocname, cphone, cemail, sdate, edate, remail, material,partnumber, 'Pending with manager',quantity,ticket_number)
                cur.execute(insert_material_query, material_data)

            # Commit changes to the database
            mysql.connection.commit()

            # Close the cursor
            cur.close()

            return redirect('/oelab')




@app.route('/multilab', methods=['POST', 'GET'])
def multilab():
    if 'loggedin' in session:
        if request.method == 'POST':
            pselect = request.form['pselect']
            pname = request.form['pname']
            sdate = request.form['sdate']
            edate = request.form['edate']
            prefix = 'ANPL-'
            ticket_number = generate_ticket_number(prefix)
            generated_ticket_numbers.append(ticket_number)
            materials_json = request.form['materials']
            quantities = request.form.getlist('quantities')
        # Parse JSON data into Python lists
            materials = json.loads(materials_json)
            materials = [material for material in materials if material is not None]
            print("Received materials:", materials)
            print("Received quantities:", quantities)
            name = session.get('uname')
            cur = mysql.connection.cursor()
            insert_material_query = "INSERT INTO lab (name, purpose,material,quantity,start_date,end_date,status,pname,Part_No,tno) VALUES (%s, %s, %s, %s, %s,%s,%s,%s,%s,%s)"
            for material, quantity in zip(materials, quantities):
                cur.execute("SELECT Part_No FROM inventory where Description=%s",(material,))
                part_data=cur.fetchone()
                partnumber = part_data[0]
                material_data = (name, pselect, material, quantity, sdate, edate, 'Pending with manager',pname,partnumber,ticket_number)
                cur.execute(insert_material_query, material_data)

            # Commit changes to the database
            mysql.connection.commit()

            # Close the cursor
            cur.close()

            return redirect('/lab')





@app.route('/multidemouser', methods=['POST', 'GET'])
def multidemouser():
    if 'loggedin' in session:
        if request.method == 'POST':
            cname = request.form['cname']
            cpocname = request.form['cpocname']
            cphone = request.form['cphone']
            cemail = request.form['cemail']
            sdate = request.form['sdate']
            edate = request.form['edate']
            remail = session.get('email')
            status = "Pending with manager"
            prefix = 'ANPL-'
            ticket_number = generate_ticket_number(prefix)
            generated_ticket_numbers.append(ticket_number)
            materials_json = request.form['materials']
            quantities = request.form.getlist('quantities')
        # Parse JSON data into Python lists
            materials = json.loads(materials_json)
            materials = [material for material in materials if material is not None]
            print("Received materials:", materials)
            print("Received quantities:", quantities)

            cur = mysql.connection.cursor()
            insert_material_query = "INSERT INTO elab (cname, cpocname, cphone, cemail, sdate, edate, remail, material,Part_No,status, Qty,tno) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s,%s)"
            for material, quantity in zip(materials, quantities):
                cur.execute("SELECT Part_No FROM inventory where Description=%s",(material,))
                part_data=cur.fetchone()
                partnumber = part_data[0]
                material_data = (cname, cpocname, cphone, cemail, sdate, edate, remail, material,partnumber,status ,quantity,ticket_number)
                cur.execute(insert_material_query, material_data)

            # Commit changes to the database
            mysql.connection.commit()

            # Close the cursor
            cur.close()

            return redirect('/elab')

@app.route('/rdlab')
def rdlab():
    if 'loggedin' in session:
        id = request.args.get('id')
        status = 'return initiated'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE lab set status=%s  WHERE id = %s", (status,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/rlab')
    return redirect('/login')


@app.route('/milabapprove')
def milabapprove():
    if 'loggedin' in session:
        id = request.args.get('tno')
        status = 'approved by manager'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE lab set status=%s  WHERE tno = %s", (status,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/lapprove')
    return redirect('/login')



@app.route('/redlab')
def redlab():
    if 'loggedin' in session:
        id = request.args.get('id')
        status = 'return initiated'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE elab set status=%s  WHERE id = %s", (status,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/relab')
    return redirect('/login')


@app.route('/oredlab')
def oredlab():
    if 'loggedin' in session:
        id = request.args.get('id')
        status = 'return initiated'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE elab set status=%s  WHERE id = %s", (status,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/orelab')
    return redirect('/login')



@app.route('/viewc', methods=['GET', 'POST'])
def viewc():
    id = request.args.get('id')
    chat_type = 'lab'
    name = session.get('email')
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM chat WHERE lab_request_id = %s AND chat_type = %s   ORDER BY id asc", (id, chat_type))
    data = cur.fetchall()
    cur.close()

    if request.method == 'POST':
        if 'loggedin' in session and 'user_message' in request.form and 'id' in request.form:
            name = session.get('email')
            user_message = request.form['user_message']
            
            id = request.form['id']
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute('INSERT INTO chat (email, chat_type, user_message, lab_request_id) VALUES (%s, %s, %s, %s)', (name, 'lab', user_message, id))
            mysql.connection.commit()  # Don't forget to commit the changes
            cursor.close()
            return redirect(url_for('viewc', id=id))  # Redirect to the same page to refresh the chat messages
    
    return render_template('viewc.html', data=data, id=id)

@app.route('/viewcm', methods=['GET', 'POST'])
def viewcm():
    if 'loggedin' in session:
        id = request.args.get('id')
        chat_type = 'lab'
        name = session.get('email')
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM chat WHERE lab_request_id = %s AND chat_type = %s  ORDER BY id asc", (id, chat_type))
        data = cur.fetchall()
        cur.close()
       

    if request.method == 'POST':
        if 'loggedin' in session and 'admin_message' in request.form and 'id' in request.form:
            name = session.get('email')
            admin_message = request.form['admin_message']
            
            id = request.form['id']
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute('INSERT INTO chat (email, chat_type, admin_message, lab_request_id) VALUES (%s, %s, %s, %s)', (name, 'lab', admin_message, id))
            mysql.connection.commit()  # Don't forget to commit the changes
            cursor.close()
            return redirect(url_for('viewcm', id=id))  # Redirect to the same page to refresh the chat messages
    
    return render_template('viewcm.html', data=data, id=id)


@app.route('/admin/')
def admin_index():
    return render_template('admin/alogin.html')

@app.route('/admin/adashboard')
def adashboard():
    
    if 'loggedin' in session:
        total_users = 100
        return render_template('/admin/adashboard.html',total_users=total_users)
    return redirect('/admin/alogin')

@app.route('/admin/uapprove')
def uapprove():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM user where status in ('Not_Approved','rejected') ORDER BY id desc   ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/uapprove.html', data=data)
    return redirect('/admin/alogin')

@app.route('/uapprove')
def muapprove():
    tsname = session.get('tname')
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM user where status in ('Not_Approved','rejected') and tname=%s ORDER BY id desc  ",(tsname,))  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/uapprove.html', data=data)
    return redirect('/login')


@app.route('/mapprove')
def mtapprove():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'approved'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE user SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/uapprove')
    return redirect('/login')


@app.route('/maureject')
def maureject():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'rejected'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE user SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/uapprove')
    return redirect('/login')


@app.route('/admin/mapprove')
def mapprove():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'approved'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE user SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/uapprove')
    return redirect('/admin/alogin')

@app.route('/admin/ureject')
def ureject():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'rejected'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE user SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/uapprove')
    return redirect('/admin/alogin')

@app.route('/admin/maccess')
def maccess():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'manager'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE user SET type = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/roleaccess')
    return redirect('/admin/alogin')

@app.route('/admin/uaccess')
def uaccess():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'user'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE user SET type = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/roleaccess')
    return redirect('/admin/alogin')

@app.route('/admin/payoutapprove')
def payoutapprove():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'Pending with HR'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/papprove')
    return redirect('/admin/alogin')

@app.route('/mpayoutapprove')
def mpayoutapprove():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'approved'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/mapayoutapprove')
    return redirect('/login')

@app.route('/npayoutapprove')
def npayoutapprove():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'Pending with HR'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/nocpayoutapprove')
    return redirect('/login')

@app.route('/hrpayoutapprove')
def hrpayoutapprove():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'approved'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/hpayoutapprove')
    return redirect('/login')

@app.route('/hrpayoutreject')
def hrpayoutreject():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'rejected by hr'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s WHERE id = %s", (data, id))
        mysql.connection.commit()
        cur.close()
        return redirect('/hpayoutapprove')
    return redirect('/login')

@app.route('/admin/preject')
def preject():
    if 'loggedin' in session:
        id = request.args.get('id')
        data = 'rejected by manager'
        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s WHERE id = %s", (data,id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/papprove')
    return redirect('/admin/alogin')


@app.route('/mpayoutreject', methods=['POST', 'GET'])
def mpayoutreject():
    if 'loggedin' in session:
        labId = request.form['labId']
        reason = request.form['reason']
        
        print(labId)  # Debugging
        print(reason)  # Debugging
        
        # Ensure labId is an integer
        try:
            labId = int(labId)
        except ValueError:
            return jsonify({"success": False, "message": "Invalid ID format"})

        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s, rreason = %s WHERE id = %s", ('rejected by manager', reason, labId))
        mysql.connection.commit()
        cur.close()
        return redirect('/mapayoutapprove')
    return redirect('/login')


@app.route('/npayoutreject', methods=['POST','GET'])
def npayoutreject():
    if 'loggedin' in session:
        labId = request.form['labId']
        reason = request.form['reason']

        print(labId)  # Debugging
        print(reason)  # Debugging

        # Ensure labId is an integer
        try:
            labId = int(labId)
        except ValueError:
            return jsonify({"success": False, "message": "Invalid ID format"})

        cur = mysql.connection.cursor()
        cur.execute("UPDATE payout_details SET status = %s, rreason = %s WHERE id = %s", ('rejected by manager', reason, labId))
        mysql.connection.commit()
        cur.close()
        return redirect('/nocpayoutapprove')
    return redirect('/login')



@app.route('/labureject', methods=['POST','GET'])
def labureject():
    if 'loggedin' in session:
        id = request.form['rid']
        reason = request.form['reason']
        print(id)
        print(reason)
        cur = mysql.connection.cursor()
        cur.execute("UPDATE lab  SET status = %s, rreason = %s WHERE tno = %s", ('rejected by manager', reason, id))
        mysql.connection.commit()
        cur.close()
        return redirect('/lapprove')
    return redirect('/login')

@app.route('/elabureject', methods=['POST','GET'])
def elabureject():
    if 'loggedin' in session:
        id = request.form['rid']
        reason = request.form['reason']
        print(id)
        print(reason)
        cur = mysql.connection.cursor()
        cur.execute("UPDATE elab  SET status = %s, rreason = %s WHERE tno = %s", ('rejected by manager', reason, id))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/edapprove')
    return redirect('/login')

@app.route('/mlabureject', methods=['POST','GET'])
def mlabureject():
    if 'loggedin' in session:
        id = request.form['rid']
        reason = request.form['reason']
        print(id)
        print(reason)
        cur = mysql.connection.cursor()
        cur.execute("UPDATE elab  SET status = %s, rreason = %s WHERE tno = %s", ('rejected by manager', reason, id))
        mysql.connection.commit()
        cur.close()
        return redirect('/edeuapprove')
    return redirect('/login')


@app.route('/edeuapprove')
def edeuapprove():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM elab  ORDER BY id desc ')
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    id = request.args.get('id')
    if id is not None:
        cur.execute("SELECT * FROM elab WHERE id = %s", (id,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        return jsonify({
            'ticket_no': mdata[13],
            'customer_name': mdata[1],
            'customer_phone_number' : mdata[3],
            'customer_email' : mdata[4],
            'material': mdata[8],
            'Part_Number' : mdata[9],
            'status': mdata[11],
            'serial_number' : mdata[12]
        })
    cur.close()
    if 'loggedin' in session:
        return render_template('/edeuapprove.html',grouped_data=grouped_data)
    return redirect('/login')



@app.route('/admin/auser')
def auser():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM user  ORDER BY id desc ")  
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/auser.html', data=data)
    return redirect('/admin/alogin')

@app.route('/admin/payoutlist')
def payoutlist():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.enddate,p.name as pname,p.Activity,p.status,p.id,p.start_time,p.end_time FROM payout_details p inner join user u on p.name=u.uname order by p.id desc ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/payoutlist.html', data=data)
    return redirect('/admin/alogin')


@app.route('/mphistory')
def mphistory():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.enddate,p.name as pname,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname where u.tname='project'  ORDER BY p.id desc   ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/mphistory.html', data=data)
    return redirect('/login')

@app.route('/nphistory')
def nphistory():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.enddate,p.name as pname,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname where u.tname='noc'  ORDER BY p.id desc ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/nphistory.html', data=data)
    return redirect('/login')


@app.route('/hrhistory')
def hrhistory():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.enddate,p.name as pname,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname    ORDER BY p.id desc ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/hrhistory.html', data=data)
    return redirect('/login')


@app.route('/fphistory')
def fphistory():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.enddate,p.name as pname,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname where p.status='approved'  ORDER BY p.id desc  ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/fphistory.html', data=data)
    return redirect('/login')




@app.route('/admin/papprove')
def papprove():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.name as pname,p.enddate,p.Activity,p.status,p.id,p.start_time,p.end_time FROM payout_details p inner join user u on p.name=u.uname where p.status in('rejected by manager','Pending with PM')  ORDER BY p.id desc ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/papprove.html', data=data)
    return redirect('/admin/alogin')

@app.route('/mapayoutapprove')
def mapayoutapprove():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.name as pname,p.enddate,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname where p.status in('rejected by manager','Pending with PM') and u.tname='project'  ORDER BY p.id desc  ")  
    data = cur.fetchall()
    mid = request.args.get('mid')
    if mid is not None:
        cur.execute("SELECT * FROM payout_details  WHERE id = %s", (mid,))
        mdata = cur.fetchone()
        start_time_str = str(mdata[6])
        end_time_str = str(mdata[7])
        return jsonify({
            'name': mdata[1],
            'startdate': mdata[2],
            'enddate' : mdata[3],
            'Activity': mdata[4],
            'start_time' : start_time_str,
            'end_time' : end_time_str,
            'status' : mdata[5],
            'reason' : mdata[8]
       })
    cur.close()

    if 'loggedin' in session:
        return render_template('/mapayoutapprove.html', data=data)
    return redirect('/login')


@app.route('/nocpayoutapprove')
def nocpayoutapprove():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.name as pname,p.enddate,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname where p.status in('rejected by manager','Pending with PM') and u.tname='noc'  ORDER BY p.id desc ")  
    data = cur.fetchall()
    mid = request.args.get('mid')
    if mid is not None:
        cur.execute("SELECT * FROM payout_details  WHERE id = %s", (mid,))
        mdata = cur.fetchone()
        start_time_str = str(mdata[6])
        end_time_str = str(mdata[7])
        return jsonify({
            'name': mdata[1],
            'startdate': mdata[2],
            'enddate' : mdata[3],
            'Activity': mdata[4],
            'start_time' : start_time_str,
            'end_time' : end_time_str,
            'status' : mdata[5],
            'reason' : mdata[8]
       })
    cur.close()
    if 'loggedin' in session:
        return render_template('/nocpayoutapprove.html', data=data)
    return redirect('/login')


@app.route('/hpayoutapprove')
def hpayoutapprove():
    cur = mysql.connection.cursor()
    cur.execute("SELECT u.uname,u.email,p.startdate,p.name as pname,p.enddate,p.Activity,p.status,p.id,p.start_time,p.end_time,u.tname FROM payout_details p inner join user u on p.name=u.uname where p.status in('rejected by hr','Pending with HR')  ORDER BY p.id desc  ")  
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/hpayoutapprove.html', data=data)
    return redirect('/login')

@app.route('/admin/roleaccess')
def roleaccess():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM user where status='approved'  ORDER BY id desc ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/roleaccess.html', data=data)
    return redirect('/admin/alogin')

@app.route('/admin/umigration', methods=['GET', 'POST'])
def umigration():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM user where status='approved'  ORDER BY id desc  ")  # Replace 'user' with the name of your table
    data = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        if request.method == 'POST' and 'priority' in request.form:
            priority = request.form['priority']
        
            id = request.args.get('id')
            cur = mysql.connection.cursor()
            cur.execute("UPDATE user SET tname = %s WHERE id = %s  ORDER BY id desc ", (priority,id))
            mysql.connection.commit()
            cur.close()
            return redirect('/admin/umigration')
        return render_template('/admin/umigration.html', data=data)
    return redirect('/admin/alogin')

@app.route('/admin/alogin', methods=['GET', 'POST'])
def alogin():
    message = ''
    if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
        email = request.form['email']
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM admin WHERE email = %s AND password = %s', (email, password,))
        user = cursor.fetchone()
        if user:
            session['loggedin'] = True
            session['id'] = user['id']
            session['email'] = user['email']
            message = 'Logged in successfully!'
            return redirect(url_for('dashboard'))
        else:
            message = 'Please enter correct email / password!'
    return render_template('/admin/alogin.html', message=message)


@app.route('/pdashboard', methods=['POST', 'GET'])
def pdashboard():
    cur = mysql.connection.cursor()
    if request.method == 'POST':
        designation = request.form['designation']
        cur.execute('''
    SELECT p.name, SUM(p.Jan) AS Jan, SUM(p.Feb) AS Feb, SUM(p.Mar) AS Mar, SUM(p.April) AS April,
    SUM(p.May) AS May, SUM(p.June) AS June, SUM(p.July) AS July, SUM(p.Aug) AS Aug, SUM(p.Sept) AS Sept,
    SUM(p.Oct) AS Oct, SUM(p.Nov) AS Nov, SUM(p.Dece) AS Dece
    FROM pms p INNER JOIN user u ON p.name = u.uname WHERE u.designation = %s GROUP BY p.name
        ''', (designation,))
        data = cur.fetchall()

        labels = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dece']
        datasets = []
        colors = ['red', 'green', 'orange', 'pink']
        random.shuffle(colors)

        for row in data:
    # Constructing data for each dataset
            data_row = [row[i] for i in range(1, len(row))]  # Excluding the name
            color_index = len(datasets) % len(colors)
            datasets.append({
                'label': row[0],  # Use the name as label
                'data': data_row,
                'backgroundColor': colors[color_index],
                'borderColor': colors[color_index],
                'borderWidth': 1
            })

    else:
        designation = 'All Engineers monthly performance %'
        cur.execute('''
    SELECT p.name, SUM(p.Jan) AS Jan, SUM(p.Feb) AS Feb, SUM(p.Mar) AS Mar, SUM(p.April) AS April,
    SUM(p.May) AS May, SUM(p.June) AS June, SUM(p.July) AS July, SUM(p.Aug) AS Aug, SUM(p.Sept) AS Sept,
    SUM(p.Oct) AS Oct, SUM(p.Nov) AS Nov, SUM(p.Dece) AS Dece
    FROM pms p INNER JOIN user u ON p.name = u.uname WHERE u.designation in ("Network_Engineer","Senior_Network_Engineer","Technical_Associate") GROUP BY p.name
        ''')
        data = cur.fetchall()

        labels = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dece']
        datasets = []
        colors = ['red','green','orange','pink']
        random.shuffle(colors)

        for row in data:
            data_row = [row[i] for i in range(1, len(row))]  # Excluding the name
            color_index = len(datasets) % len(colors)
            datasets.append({
                'label': row[0],  # Use the name as label
                'data': data_row,
                'backgroundColor': colors[color_index],
                'borderColor': colors[color_index],
                'borderWidth': 1
            })

    cur.execute("SELECT count(*) as ne FROM user where designation='Network_Engineer' ")
    result = cur.fetchone()
    ne_count = result[0]
    cur.execute("SELECT count(*) as sne FROM user where designation='Senior_Network_Engineer' ")
    result1 = cur.fetchone()
    sne_count = result1[0]
    cur.execute("SELECT count(*) as ne FROM user where designation='Technical_Associate' ")
    result2 = cur.fetchone()
    ta_count = result2[0]
    cur.close()
    return render_template('pdashboard.html', labels=labels, datasets=datasets, ne_count=ne_count,sne_count=sne_count,ta_count=ta_count,designation=designation)


@app.route('/inventory')
def inventory():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute("SELECT slno, OEM, Part_No, Description, Qty, REPLACE(SerialNo, ',', ',\n') AS SerialNumbers FROM inventory")
    rows = cur.fetchall()
    data = []
    for row in rows:
        serial_numbers = row[5].split(',')
        serial_numbers = [serial.strip() for serial in serial_numbers]
        data.append((*row[:5], serial_numbers))
    cur.close()
    if 'loggedin' in session:
        return render_template('inventory.html', data=data)
    return redirect('/login')


@app.route('/inventoryadd',methods=['GET', 'POST'])
def inventoryadd():
    if request.method == 'POST':
        OEM = request.form['OEM']
        Part_No = request.form['Part_No']
        Description = request.form['Description']
        Qty = request.form['Qty']
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO inventory VALUES (NULL, %s, %s, %s,%s)',
                       (OEM, Part_No, Description,Qty))
        mysql.connection.commit()
        message = 'inventory added successfully'
        return redirect('/inventory')
    return redirect('/inventory')


@app.route('/inventorydelete')
def inventorydelete():
    if 'loggedin' in session:
        id = request.args.get('id')
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM inventory WHERE slno = %s", (id,))
        mysql.connection.commit()
        cur.close()
        return redirect('/inventory')
    return redirect('/login')

@app.route('/download_csv',methods=['POST'])
def download_csv():
    if 'loggedin' in session:
        if request.method == "POST":
            cur = mysql.connection.cursor()
            from1 = request.form['from']
            to = request.form['to']
            cur.execute("SELECT  p.name, u.tname,p.startdate, p.enddate, p.Activity,  p.start_time, p.end_time FROM payout_details p INNER JOIN user u ON p.name=u.uname WHERE p.status='approved' AND p.startdate >= %s AND p.enddate <= %s ",(from1,to))
            data = cur.fetchall()

            # Check if there are any rows returned
            if not data:
                return "No data found"

            # Calculate total hours for each row
            csv_data = []
            for row in data:
                start_time = row[5]  # Index of start_time column
                end_time = row[6]    # Index of end_time column
                total_hours = (end_time - start_time).total_seconds() / 3600
                csv_data.append(list(row) + [total_hours])

            # Set up response headers
            csv_stream = io.StringIO()
            writer = csv.writer(csv_stream)
            writer.writerow([ 'name','tname' ,'startdate','enddate', 'Activity',  'start_time', 'end_time', 'total_hours'])
            for row in csv_data:
                activity = re.sub(r'<[^>]*>', '', row[4])  # Remove HTML tags
                row[4] = activity.strip()  # Remove leading and trailing whitespaces
                writer.writerow(row)
            # Set up response headers
            csv_data = "attachment; filename=payout.csv"
            response = Response(csv_stream.getvalue(), mimetype='text/csv')
            response.headers['Content-Disposition'] = csv_data

            cur.close()

            return response
    else:
        return redirect('/login')

@app.route('/mpayout_edit', methods=['POST', 'GET'])
def mpayout_edit():
    if request.method == 'POST':
        print("Submitted")
        ide = request.form['ide']
        print(ide)
        startdate = request.form['startdate']
        print(startdate)
        enddate = request.form['enddate']
        print(enddate)
        Activity = request.form['Activity']
        print(Activity)
        start_time = request.form['start_time']
        print(start_time)
        end_time = request.form['end_time']
        print(end_time)
        cur = mysql.connection.cursor()
        try:
            cur.execute("UPDATE payout_details SET startdate=%s, enddate=%s, Activity=%s,start_time=%s,end_time=%s WHERE id=%s", (startdate, enddate, Activity,start_time,end_time,ide))
            mysql.connection.commit()
            flash('PMS record updated successfully', 'success')
        except Exception as e:
            mysql.connection.rollback()
            flash(f'Error updating PMS record: {str(e)}', 'danger')
        finally:
            cur.close()
        
        return redirect(url_for('mapayoutapprove'))
    else:
        cur = mysql.connection.cursor()
        id = request.args.get('id')
        cur.execute("SELECT * FROM payout_details WHERE id=%s", (id,))
        data = cur.fetchone()
        cur.close()
        return render_template('mpayout_edit.html', row=data,id=id)




@app.route('/inventoryedit', methods=['POST', 'GET'])
def inventoryedit():
    if request.method == 'POST':
        ide = request.form['ide']
        OEM = request.form['OEM']
        Part_No = request.form['Part_No']
        Description = request.form['Description']
        Qty = request.form['Qty']
        cur = mysql.connection.cursor()
        try:
            cur.execute("UPDATE inventory SET OEM=%s, Part_No=%s, Description=%s,Qty=%s WHERE slno=%s", (OEM, Part_No, Description,Qty,ide))
            mysql.connection.commit()
            flash('PMS record updated successfully', 'success')
        except Exception as e:
            mysql.connection.rollback()
            flash(f'Error updating PMS record: {str(e)}', 'danger')
        finally:
            cur.close()

        return redirect(url_for('inventory'))
    else:
        cur = mysql.connection.cursor()
        id = request.args.get('id')
        cur.execute("SELECT * FROM inventory WHERE slno=%s", (id,))
        data = cur.fetchone()
        cur.close()
        return render_template('inventoryedit.html', row=data,id=id)



@app.route('/inventory_upload', methods=['POST'])
def upload_csv():
    if request.method == 'POST':
        # Check if the POST request has the file part
        if 'file' not in request.files:
            return "No file part"

        file = request.files['file']

        # If the user does not select a file, the browser submits an empty file without a filename
        if file.filename == '':
            return "No selected file"

        if file:
            # Read the CSV file
            df = pd.read_csv(file)

            # Connect to MySQL and insert data
            try:
                cursor = mysql.connection.cursor()

                # Loop through each row in the DataFrame and insert into MySQL table
                for index, row in df.iterrows():
                    cursor.execute(
                        "INSERT INTO inventory (OEM, Part_No, Description, Qty) VALUES (%s, %s, %s, %s)",
                        (row['OEM'], row['Part_No'], row['Description'], row['Qty'])
                    )

                mysql.connection.commit()
                cursor.close()

                return "Uplaoded Susccesfully"
            except Exception as e:
                return f"An error occurred: {str(e)}"

@app.route('/elab', methods=['GET', 'POST'])
def elab():
    message = ''
    name = session.get('email')
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM elab  WHERE remail = %s  ORDER BY id desc', (name,))
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    cur.execute('SELECT * FROM inventory')
    inventoryname = cur.fetchall()

    if request.method == "POST":
        material = request.form['material']
        cur = mysql.connection.cursor()
        cur.execute('SELECT Qty FROM inventory WHERE Description = %s', (material,))
        qt = cur.fetchone()
        if qt:
            # Return quantity as JSON response
            return jsonify({'quantity': qt[0]})
        else:
            # Return quantity as null if not found
            return jsonify({'quantity': None})
    mid = request.args.get('mid')
    if mid is not None:
        cur.execute("SELECT * FROM elab WHERE id = %s", (mid,))
        mdata = cur.fetchone()
        material = mdata[8]
        print(material)
        cur.execute("SELECT SerialNo FROM inventory WHERE Description = %s", (material,))
        inventory_serial_numbers = [serial.strip() for row in cur.fetchall() for serial in row[0].split(',')]
        print(inventory_serial_numbers)
        elab_serial_numbers = [serial.strip() for serial in mdata[12].split(',')]
        print(elab_serial_numbers)
        matching_serial_numbers = [serial for serial in elab_serial_numbers if serial in inventory_serial_numbers]
        print(matching_serial_numbers)
        # Assuming you want to return specific fields from mdata
        return jsonify({
            'ticket_no': mdata[13],
            'customer_name': mdata[1],
            'customer_phone_number' : mdata[3],
            'customer_email' : mdata[4],
            'material': mdata[8],
            'Part_Number' : mdata[9],
            'status': mdata[11],
            'serial_number' : matching_serial_numbers
        })
    cur.close()
    if 'loggedin' in session:
        return render_template('elab.html', grouped_data=grouped_data, inventoryname=inventoryname)
    return redirect('/login')

@app.route('/oelab', methods=['GET', 'POST'])
def oelab():
    
    message = ''
    name = session.get('email')
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM elab order by id desc")
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    cur.execute('SELECT * FROM inventory')
    inventoryname = cur.fetchall()
    if request.method == "POST":
        material = request.form['material']
        cur = mysql.connection.cursor()
        cur.execute('SELECT Qty FROM inventory WHERE Description = %s', (material,))
        qt = cur.fetchone()
        cur.close()
        if qt:
            # Return quantity as JSON response
            return jsonify({'quantity': qt[0]})
        else:
            # Return quantity as null if not found
            return jsonify({'quantity': None})
    mid = request.args.get('mid')
    if mid is not None:
        cur.execute("SELECT * FROM elab WHERE id = %s", (mid,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        material = mdata[8]
        print(material)
        cur.execute("SELECT SerialNo FROM inventory WHERE Description = %s", (material,))
        inventory_serial_numbers = [serial.strip() for row in cur.fetchall() for serial in row[0].split(',')]
        print(inventory_serial_numbers)
        elab_serial_numbers = [serial.strip() for serial in mdata[12].split(',')]
        print(elab_serial_numbers)
        matching_serial_numbers = [serial for serial in elab_serial_numbers if serial in inventory_serial_numbers]
        print(matching_serial_numbers)
        return jsonify({
            'ticket_no': mdata[13],
            'customer_name': mdata[1],
            'customer_phone_number' : mdata[3],
            'customer_email' : mdata[4],
            'material': mdata[8],
            'Part_Number' : mdata[9],
            'status': mdata[11],
            'serial_number' : matching_serial_numbers
        })
    cur.close()
    if 'loggedin' in session:
        return render_template('oelab.html',  inventoryname=inventoryname,grouped_data=grouped_data)

    return redirect('/login')



@app.route('/elabadd',methods=['GET', 'POST'])
def elabadd():
    if request.method == 'POST':
        cname = request.form['cname']
        cpocname = request.form['cpocname']
        cphone = request.form['cphone']
        cemail = request.form['cemail']
        sdate = request.form['sdate']
        material = request.form.getlist('material')
        edate = request.form['edate']
        quantity = request.form['quantity']
        name = session.get('email')
        cur= mysql.connection.cursor()
        cur.execute("SELECT Part_No FROM inventory where Description=%s",(material,))
        part_data=cur.fetchone()
        partnumber = part_data[0]
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        prefix = 'ANPL-'
        ticket_number = generate_ticket_number(prefix)
        generated_ticket_numbers.append(ticket_number) 
        status = "Pending with manager"
        cursor.execute('INSERT INTO elab (cname, cpocname ,cphone, cemail, sdate, edate,remail,material,Part_No,Qty,status,tno) VALUES (%s,  %s,%s,%s, %s, %s, %s, %s,%s,%s,%s,%s)',
               (cname,cpocname,cphone,cemail,sdate,edate,name,",".join(material),partnumber,quantity,status,ticket_number))
        mysql.connection.commit()
        message = 'Payout added successfully'
        return redirect('/elab')
    return redirect('/elab')

@app.route('/oelabadd',methods=['POST'])
def oelabadd():
    if request.method == 'POST':
        cname = request.form['cname']
        cpocname = request.form['cpocname']
        cphone = request.form['cphone']
        cemail = request.form['cemail']
        sdate = request.form['sdate']
        material = request.form['material']
        edate = request.form['edate']
        quantity = request.form['quantity']
        name = request.form['remail']
        cur= mysql.connection.cursor()
        cur.execute("SELECT Part_No FROM inventory where Description=%s",(material,))
        part_data=cur.fetchone()
        partnumber = part_data[0]
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        prefix = 'ANPL-'
        ticket_number = generate_ticket_number(prefix)
        generated_ticket_numbers.append(ticket_number) 
        status = "Pending with manager"
        cursor.execute('INSERT INTO elab (cname, cpocname ,cphone, cemail, sdate, edate,remail,material,Part_No,Qty,status,tno) VALUES (%s,  %s,%s,%s, %s, %s, %s, %s,%s,%s,%s,%s)',
               (cname,cpocname,cphone,cemail,sdate,edate,name,material,partnumber,quantity,status,ticket_number))
        mysql.connection.commit()
        return redirect('/oelab')
    return redirect('/oelab')

@app.route('/elapprove')
def elapprove():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM elab order by id desc")
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    id = request.args.get('id')
    if id is not None:
        cur.execute("SELECT * FROM elab WHERE id = %s", (id,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        material = mdata[8]
        print(material)
        cur.execute("SELECT SerialNo FROM inventory WHERE Description = %s", (material,))
        inventory_serial_numbers = [serial.strip() for row in cur.fetchall() for serial in row[0].split(',')]
        print(inventory_serial_numbers)
        elab_serial_numbers = [serial.strip() for serial in mdata[12].split(',')]
        print(elab_serial_numbers)
        matching_serial_numbers = [serial for serial in elab_serial_numbers if serial in inventory_serial_numbers]
        print(matching_serial_numbers)
        return jsonify({
            'ticket_no': mdata[13],
            'customer_name': mdata[1],
            'customer_phone_number' : mdata[3],
            'customer_email' : mdata[4],
            'material': mdata[8],
            'Part_Number' : mdata[9],
            'status': mdata[11],
            'serial_number' : matching_serial_numbers,
        })
    
    if 'loggedin' in session:
        return render_template('elapprove.html', grouped_data=grouped_data)
    return redirect('/login')

@app.route('/addserial', methods=['POST'])
def get_serial_numbers():
    if request.method == 'POST':
        tno = request.form.get('tno')
        print(f"Received tno: {tno}")
        cur = mysql.connection.cursor()

        # Fetch materials from lab and elab tables
        cur.execute('SELECT material FROM lab WHERE tno = %s', (tno,))
        lab_material_rows = cur.fetchall()
        print(f"lab_material_rows: {lab_material_rows}")

        cur.execute('SELECT material FROM elab WHERE tno = %s', (tno,))
        elab_material_rows = cur.fetchall()
        print(f"elab_material_rows: {elab_material_rows}")

        # Combine materials from both lab and elab
        all_materials = set()
        for material_row in lab_material_rows:
            all_materials.add(material_row[0])
        for material_row in elab_material_rows:
            all_materials.add(material_row[0])
        print(f"Combined materials: {all_materials}")

        # Initialize a dictionary to store serial numbers for each material
        material_serial_dict = {}
        vqty = {}
        # Check if materials exist
        if all_materials:
            for material in all_materials:
                print(f"Processing material: {material}")
                cur.execute('SELECT Qty FROM elab WHERE material = %s AND tno = %s',(material,tno))
                uqty = cur.fetchall()
                if uqty:
                    vqty[material] = uqty[0][0]
                else:
                    vqty[material] = None  
                cur.execute('SELECT serialNumber FROM lab WHERE material = %s', (material,))
                lab_rows = cur.fetchall()
                print(f"lab_rows for material {material}: {lab_rows}")
                lab_serial_numbers = [row[0] for row in lab_rows if row[0] != 'snoserial']

                cur.execute('SELECT serialNumber FROM elab WHERE material = %s', (material,))
                elab_rows = cur.fetchall()
                print(f"elab_rows for material {material}: {elab_rows}")
                elab_serial_numbers = [row[0] for row in elab_rows  if row[0] != 'noserial']

                # Combine and split serial numbers from lab and elab
                all_serial_numbers = []
                for serial_group in lab_serial_numbers + elab_serial_numbers:
                    print(f"Processing serial_group: {serial_group}")
                    if serial_group:
                        serials = [serial.strip() for serial in serial_group.split(',')]
                        print(f"Split serials: {serials}")
                        all_serial_numbers.extend(serials)
                print(f"All serial numbers for material {material}: {all_serial_numbers}")

                # Fetch all serial numbers from inventory
                cur.execute('SELECT SerialNo FROM inventory WHERE Description = %s', (material,))
                inventory_rows = cur.fetchall()
                print(f"Inventory rows: {inventory_rows}")
                inventory_serial_numbers = [row[0].split(',') for row in inventory_rows if row[0]]

                # Flatten the list of lists
                inventory_serial_numbers_flat = [item.strip() for sublist in inventory_serial_numbers for item in sublist]
                print(f"Flattened inventory serial numbers: {inventory_serial_numbers_flat}")

                # Compare and find serial numbers not in inventory
                new_serial_numbers = [serial for serial  in inventory_serial_numbers_flat if serial and serial  not in all_serial_numbers]
                print(f"New serial numbers for material {material}: {new_serial_numbers}")

                # Store serial numbers for the material in the dictionary
                material_serial_dict[material] = new_serial_numbers
                
        cur.close()
        print(vqty)
        if 'loggedin' in session:
            print(f"Rendering template with material_serial_dict: {material_serial_dict} and tno: {tno}")
            return render_template('addserial.html', material_serial_dict=material_serial_dict, tno=tno,vqty=vqty)

    # Redirect to login if not logged in or if material id not found
    print("Redirecting to login")
    return redirect('/login')

@app.route('/laddserial', methods=['POST'])
def laddserial():
    if request.method == 'POST':
        tno = request.form.get('tno')
        cur = mysql.connection.cursor()

        # Fetch materials from elab table
        cur.execute('SELECT material FROM lab WHERE tno = %s', (tno,))
        material_rows = cur.fetchall()

        # Initialize a dictionary to store serial numbers for each material
        material_serial_dict = {}

        # Check if materials exist
        if material_rows:
            for material_row in material_rows:
                material = material_row[0]  # Get the material name

                # Fetch serial numbers for the material
                cur.execute('SELECT SerialNo FROM inventory WHERE Description = %s', (material,))
                rows = cur.fetchall()

                # Extract and store serial numbers in the dictionary
                serial_numbers = []
                for row in rows:
                    serial_numbers.extend(row[0].split(','))

                # Store serial numbers for the material in the dictionary
                material_serial_dict[material] = serial_numbers

        cur.close()

        if 'loggedin' in session:
            return render_template('laddserial.html', material_serial_dict=material_serial_dict,tno=tno)

    # Redirect to login if not logged in or if material id not found
    return redirect('/login')


@app.route('/elapproveview',methods=['GET'])
def elapproveview ():
    cur = mysql.connection.cursor()
    id = request.args.get('id')
    cur.execute("SELECT * FROM elab where id=%s   ",(id,))
    sidata = cur.fetchall()
    cur.close()
    if 'loggedin' in session:
        return render_template('elapproveview.html',sidata=sidata)
    return redirect('/login')

@app.route('/admin/edapprove')
def edapprove():
    message = ''
    cur = mysql.connection.cursor()
    cur.execute('SELECT * FROM elab  ORDER BY id desc ')
    data = cur.fetchall()
    grouped_data = {}
    for key, group in groupby(data, lambda x: x[13]):
        grouped_data[key] = list(group)
    id = request.args.get('id')
    if id is not None:
        cur.execute("SELECT * FROM elab WHERE id = %s", (id,))
        mdata = cur.fetchone()
        # Assuming you want to return specific fields from mdata
        material = mdata[8]
        print(material)
        cur.execute("SELECT SerialNo FROM inventory WHERE Description = %s",(material,))
        
        inventory_serial_numbers = [serial.strip() for row in cur.fetchall() for serial in row[0].split(',')]

        print(inventory_serial_numbers)
		
        lab_serial_numbers = [serial.strip() for serial in mdata[12].split(',')]
		
        print(lab_serial_numbers)
		
        matching_serial_numbers = [serial for serial in lab_serial_numbers if serial in inventory_serial_numbers]
		
        print(matching_serial_numbers)
        
        return jsonify({
            'ticket_no': mdata[13],
            'customer_name': mdata[1],
            'customer_phone_number' : mdata[3],
            'customer_email' : mdata[4],
            'material': mdata[8],
            'Part_Number' : mdata[9],
            'status': mdata[11],
            'serial_number' : matching_serial_numbers
        })
    cur.close()
    if 'loggedin' in session:
        return render_template('/admin/edapprove.html',grouped_data=grouped_data)
    return redirect('/login')

@app.route('/elabapprove', methods=['POST', 'GET'])
def elabapprove():
    if 'loggedin' in session:
        if request.method == 'POST':
            final_status = 'approved'
            tno = request.form['tno']
            selected_serial_numbers = request.form.getlist('serialNumber')
            
            # Fetch the IDs associated with the given tno
            cur = mysql.connection.cursor()
            cur.execute("SELECT id FROM lab WHERE tno = %s", (tno,))
            ids = [row[0] for row in cur.fetchall()]
            materials = []
            lab_quantities = []

            # Update the serial numbers for each ID
            for id in zip(ids):
                # Fetch existing material and quantity
                cur.execute("SELECT material, quantity FROM lab WHERE id = %s", (id,))
                material, quantity = cur.fetchone()
                materials.append(material)
                lab_quantities.append(quantity)

                # Update the database with the new serial numbers
                cur.execute("UPDATE lab SET status = %s, serialNumber = %s WHERE id = %s", (final_status, ", ".join(selected_serial_numbers), id))
                # Fetch the current quantity from the inventory
                cur.execute("SELECT Qty FROM inventory WHERE Description = %s", (material,))
                current_qty = cur.fetchone()[0]

                # Calculate the new quantity after subtraction
                new_qty = current_qty - quantity

                # Update the inventory quantity
                cur.execute("UPDATE inventory SET Qty = %s WHERE Description = %s", (new_qty, material))

            # Commit changes and close the cursor
            mysql.connection.commit()
            cur.close()

            return redirect('/lapprove')
    return redirect('/login')

@app.route('/elabapproveadd', methods=['POST', 'GET'])
def elabapproveadd():
    if 'loggedin' in session:
        if request.method != 'POST':
            final_status = 'returned approved'
            tno = request.args.get('tno')
            cur = mysql.connection.cursor()
            cur.execute("SELECT id FROM lab WHERE tno = %s", (tno,))
            ids = [row[0] for row in cur.fetchall()]
            materials = []
            lab_quantities = []

            # Update the serial numbers for each ID
            for id in zip(ids):
                # Fetch existing material and quantity
                cur.execute("SELECT material, quantity FROM lab WHERE id = %s", (id,))
                material, quantity = cur.fetchone()
                materials.append(material)
                lab_quantities.append(quantity)

                cur.execute("UPDATE lab SET status = %s WHERE id = %s", (final_status, id))
                # Fetch the current quantity from the inventory
                cur.execute("SELECT Qty FROM inventory WHERE Description = %s", (material,))
                current_qty = cur.fetchone()[0]

                # Calculate the new quantity after subtraction
                new_qty = current_qty + quantity

                # Update the inventory quantity
                cur.execute("UPDATE inventory SET Qty = %s WHERE Description = %s", (new_qty, material))

            # Commit changes and close the cursor
            mysql.connection.commit()
            cur.close()

            return redirect('/lapprove')
        return redirect('/lapprove')
    return redirect('/login')


@app.route('/inventorylogs', methods=['POST', 'GET'])
def inventorylogs():
    cur = mysql.connection.cursor()
    desc = request.args.get('desc')
    cur.execute("SELECT * FROM lab  WHERE material=%s AND status in ('approved','return initiated') ", (desc,))
    data = cur.fetchall()
    cur.execute("SELECT * FROM elab  WHERE material=%s AND status in ('approved','return initiated') ", (desc,))
    edata = cur.fetchall()
    cur.execute("SELECT * FROM inventory WHERE Description=%s", (desc,))
    rqty = cur.fetchall()
    cur.execute("SELECT SUM(Qty) AS total_quantity FROM inventory WHERE Description=%s", (desc,))
    inventory_data = cur.fetchone()
    total_quantity_inventory = inventory_data[0] if inventory_data else 0
    total_quantity_lab = sum(row[4] for row in data)
    total_quantity_elab = sum(row1[10] for row1 in edata)
    total_quantity = total_quantity_lab + total_quantity_inventory + total_quantity_elab
    cur.close()
    return render_template('inventorylogs.html', data=data, desc=desc, rqty=rqty, total_quantity=total_quantity,edata=edata)


@app.route('/admin/premove')
def premove():
    if 'loggedin' in session:
        id = request.args.get('id')
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM payout_details WHERE id = %s", (id,))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/payoutlist')

@app.route('/edlab', methods=['POST', 'GET'])
def edlab():
    if 'loggedin' in session:
        if request.method == 'POST':  
            id = request.form['id']
            end_date = request.form['end_date']
            cur = mysql.connection.cursor()
            cur.execute("UPDATE lab SET end_date=%s  WHERE id = %s", (end_date,id,))
            mysql.connection.commit()
            cur.close()
            return redirect('/rlab')
        return redirect('/login')

@app.route('/certupdate', methods=['POST', 'GET'])
def certupdate():
    if 'loggedin' in session:
        if request.method == 'POST':
            id = request.form['id']
            end_date = request.form['end_date']
            reason = request.form['reason']
            cur = mysql.connection.cursor()
            cur.execute("UPDATE certification SET target_date=%s,reason=%s  WHERE id = %s", (end_date,reason,id,))
            mysql.connection.commit()
            cur.close()
            return redirect('/upcoming_certificate')
        return redirect('/login')

@app.route('/eddlab', methods=['POST', 'GET'])
def eddlab():
    if 'loggedin' in session:
        if request.method == 'POST':
            id = request.form['id']
            end_date = request.form['end_date']
            cur = mysql.connection.cursor()
            cur.execute("UPDATE elab SET edate=%s  WHERE id = %s", (end_date,id,))
            mysql.connection.commit()
            cur.close()
            return redirect('/rlab')
        return redirect('/login')



@app.route('/oeddlab', methods=['POST', 'GET'])
def oeddlab():
    if 'loggedin' in session:
        if request.method == 'POST':
            id = request.form['id']
            end_date = request.form['end_date']
            cur = mysql.connection.cursor()
            cur.execute("UPDATE elab SET edate=%s  WHERE id = %s", (end_date,id,))
            mysql.connection.commit()
            cur.close()
            return redirect('/orelab')
        return redirect('/login')


@app.route('/admin/medapprove', methods=['POST', 'GET'])
def medapprove():
    if 'loggedin' in session:
        tno = request.args.get('tno')
        cur = mysql.connection.cursor()
        cur.execute("SELECT uname FROM user where tname='operation' AND type='manager'  ")
        uname = cur.fetchone()
        name = uname[0]
        status = f"Pending with {name}"
        cur.execute("UPDATE elab SET status=%s  WHERE tno = %s", (status,tno,))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/edapprove')
    return redirect('/login')
generated_ticket_numbers = []

def generate_ticket_number(prefix, length=5):
    while True:
        # Generate random numeric part
        numeric_part = ''.join(random.choices(string.digits, k=length))

        # Generate ticket number
        ticket_number = prefix + numeric_part

        # Check if ticket number already exists in generated_ticket_numbers
        if ticket_number not in generated_ticket_numbers:
            return ticket_number

@app.route('/admin/coem')
def coem():
    if 'loggedin' in session:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM oem_cert order by id desc')
        data = cur.fetchall()
        return render_template('/admin/coem.html',data=data)

@app.route('/forgotpassword')
def forgotpassword():
    return render_template('/forgotpassword.html')

@app.route('/otpverify')
def otpveirfy():
    return render_template('/otpverify.html')

def generate_otp():
    return str(random.randint(100000, 999999))

def send_email(receiver_email, body, sender_email, subject):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "amtairowire@gmail.com"
    smtp_password = "cootssnoqqaozhyv"
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "html"))

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(sender_email, receiver_email, message.as_string())

@app.route('/send_otp', methods=['POST'])
def send_otp():
    email = request.form['email']
    print(email)
    if email:
        otp = generate_otp()
        sender_email = "your_email@example.com"  # Enter your email address
        subject = "OTP Verification"
        body = f"Your OTP is: {otp}"
        send_email(email, body, sender_email, subject)
        session['email'] = email
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM fpotp WHERE email=%s',(email,))
        mysql.connection.commit()
        cur.execute('INSERT INTO fpotp VALUES (NULL, %s,%s)', (email,otp))
        mysql.connection.commit()
        return """
            <script>
                alert("OTP Sent Successfully");
                window.location.href = "/otpverify";
            </script>
        """
    else:
         return """
            <script>
                alert("Issues in sending OTP, please try again");
                window.location.href = "/otpverify";
            </script>
        """
@app.route('/changepassword')
def changepassword():
    return render_template('/changepassword.html')

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    if request.method == 'POST':
        email = request.form['email']
        session['email'] = email
        otp = request.form['otp']
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM fpotp WHERE email=%s AND otp=%s', (email,otp))
        user = cur.fetchone()
        if user:
            return """
            <script>
                alert("Verified successfully");
                window.location.href = "/changepassword";
            </script>
            """
        else:
            return """
            <script>
                alert("Please check otp again");
                window.location.href = "/otpverify";
            </script>
            """
@app.route('/update_password', methods=['POST'])
def update_password():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur = mysql.connection.cursor()
        cur.execute('UPDATE user SET  password=%s WHERE email=%s', (hashed_password,email))
        mysql.connection.commit()
        return """
            <script>
                alert("password changed successfully");
                window.location.href = "/";
            </script>
        """
    else:
        return """
            <script>
                alert("password not updated try again");
                window.location.href = "/changepassword";
            </script>
        """

@app.route('/eoem', methods=['GET'])
def eoem():
    id = int(request.args.get('id'))
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM oem_cert WHERE id = %s", (id,))
    data = cur.fetchone()
    cur.close()
    return render_template('/admin/eoem.html', data=data,id=id)

@app.route('/oemadd',methods=['GET', 'POST'])
def oemadd():
    if request.method == 'POST':
        cname = request.form['cname']
        oem = request.form['oem']
        cost = request.form['cost']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('INSERT INTO oem_cert (cname,OEM,cost) VALUES (%s,%s, %s)',
                       (cname, oem,cost))
        mysql.connection.commit()
        return redirect('/admin/coem')
    return redirect('/admin/coem')

@app.route('/updatecoem', methods=['POST'])
def update_data():
    id = int(request.form['id'])
    cname = request.form['cname']
    oem = request.form['oem']
    cost = request.form['cost']
    cur = mysql.connection.cursor()
    cur.execute("UPDATE oem_cert SET cname = %s, oem = %s, cost = %s WHERE id = %s", (cname, oem, cost, id))
    mysql.connection.commit()
    cur.close()
    return """
            <script>
                alert("Updated Successfully");
                window.location.href = "/admin/coem";
            </script>
        """


@app.route('/doem')
def doem():
    if 'loggedin' in session:
        id = request.args.get('id')
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM oem_cert WHERE id = %s", (id,))
        mysql.connection.commit()
        cur.close()
        return redirect('/admin/coem')
    return redirect('/login')

def cert_email(subject, body, to_emails, cc_emails=None):
    from_email = 'amtairowire@gmail.com'
    from_password = 'cootssnoqqaozhyv'

    if isinstance(to_emails, str):
        to_emails = [to_emails]

    try:
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = ', '.join(to_emails)
        if cc_emails:
            msg['Cc'] = ', '.join(cc_emails)
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('142.251.175.108', 587)
        server.starttls()
        server.login(from_email, from_password)
        recipients = to_emails + (cc_emails if cc_emails else [])
        text = msg.as_string()
        server.sendmail(from_email, recipients, text)
        server.quit()
        print(f"Email sent to {', '.join(to_emails)}")
    except Exception as e:
        print(f"Failed to send email to {', '.join(to_emails)}: {e}")

def query_and_send_emails(days_before):
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        query = f"""
        SELECT c.cname, c.edate, u.email FROM certification c INNER JOIN user u ON c.name = u.uname WHERE c.edate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL {days_before} DAY);
        """
        cur.execute(query)
        results = cur.fetchall()
        for row in results:
            cname = row['cname']
            edate = row['edate']
            email = row['email']
            subject = f"Expiry Notice for {cname}"
            body = f"Dear User,\n\nThe item '{cname}' is expiring on {edate}. Please apply for the exam again.\n\nBest regards,\nAMT Team"
            cc_emails = ['yogeshas91889@gmail.com', 'mj@airowire.com']
            cert_email(subject, body, [email], cc_emails)
        cur.close()
    except Exception as e:
        print(f"Error in query_and_send_emails({days_before}): {e}")


def query_and_send_emails_hours(hours_before):
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        query = f"""
         SELECT c.cname, c.edate, u.email FROM certification c INNER JOIN user u ON c.name = u.uname WHERE c.edate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL {hours_before} HOUR);
        """
        cur.execute(query)
        results = cur.fetchall()
        for row in results:
            cname = row['cname']
            edate = row['edate']
            email = row['email']
            subject = f"Expiry Notice for {cname}"
            body = f"Dear User,\n\nThe item '{cname}' is expiring on {edate}. Please apply for the exam again.\n\nBest regards,\nAMT Team"
            cc_emails = ['yogeshas91889@gmail.com', 'mj@airowire.com']
            cert_email(subject, body, email,cc_emails)
        cur.close()
    except Exception as e:
        print(f"Error in query_and_send_emails_hours({hours_before}): {e}")

@scheduler.task('interval', id='check_and_send_emails_60_days', hours=24)
def scheduled_task_60_days():
    with app.app_context():
        query_and_send_emails(60)

@scheduler.task('interval', id='check_and_send_emails_30_days', hours=24)
def scheduled_task_30_days():
    with app.app_context():
        query_and_send_emails(30)

@scheduler.task('interval', id='check_and_send_emails_15_days', hours=24)
def scheduled_task_15_days():
    with app.app_context():
        query_and_send_emails(15)

@scheduler.task('interval', id='check_and_send_emails_12_hours', hours=1)
def scheduled_task_12_hours():
    with app.app_context():
        query_and_send_emails_hours(12)




# Developed by Sagar

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'loggedin' not in session:
        return redirect(url_for('login'))

    user_id = session['id']
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    category=None
    message = None

    # edit details handle 
    if request.method == 'POST':
        # Update profile information
        name = request.form.get('name')
        email = request.form.get('email')
        
        try:
            cur.execute('UPDATE user SET uname = %s, email = %s WHERE id = %s', (name, email, user_id))
            mysql.connection.commit()
            message = ('Profile information updated successfully!', 'success')
        except Exception as e:
            message = (f'Error updating profile information: {str(e)}', 'danger')

    # for handling the photo upload function
    if request.method == 'POST':
        # Photo Upload
        if 'photo' in request.files:
            photo = request.files['photo']
            if photo.filename != '' and allowed_file(photo.filename):
                filename = secure_filename(photo.filename)
                try:
                    photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    cur.execute('UPDATE user SET photo = %s WHERE id = %s', (filename, user_id))
                    mysql.connection.commit()
                    message = 'Profile photo updated successfully!', 'success'
                    # Notify user via email (optional)
                    cert_email('Profile Photo Updated', f'Your profile photo has been updated.', 'user@example.com')
                except Exception as e:
                    # Handle database or file saving errors
                    message = f'Error uploading photo: {str(e)}', 'danger'
            else:
                message = 'Invalid photo format or no photo selected', 'danger'

        # Password Update
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')

    if not all([ new_password, confirm_password]):
         message = 'Please fill out all password fields', 'danger'
    elif new_password != confirm_password:
        message = 'New Password and Confirm Password do not match', 'danger'
    else:
        try:
            cur.execute('SELECT password FROM user WHERE id = %s', (user_id,))
            user = cur.fetchone()
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cur.execute('UPDATE user SET password = %s WHERE id = %s', (hashed_password, user_id))
            mysql.connection.commit()
            message = 'Password updated successfully!', 'success'
                    # Notify user via email (optional)

                
        except Exception as e:
                # Handle database errors
            message = f'Error updating password: {str(e)}', 'danger'

    cur.execute('SELECT * FROM user WHERE id = %s', (user_id,))
    data = cur.fetchone()
    cur.close()

    return render_template('profile.html', data=data, message=message)

@app.route('/upload_photo', methods=['POST'])
def upload_photo():
    if 'loggedin' not in session:
        return redirect(url_for('login'))

    user_id = session['id']
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if 'photo' in request.files:
        photo = request.files['photo']
        if photo.filename != '' and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            try:
                photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                cur.execute('UPDATE user SET photo = %s WHERE id = %s', (filename, user_id))
                mysql.connection.commit()
                flash('Profile photo updated successfully!', 'success')
            except Exception as e:
                flash(f'Error uploading photo: {str(e)}', 'danger')
        else:
            flash('Invalid photo format or no photo selected', 'danger')
    cur.close()
    return redirect(url_for('profile'))




if __name__ == "__main__":
    if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        scheduler.start()
    app.run(debug=True,host='0.0.0.0', port=5000)
