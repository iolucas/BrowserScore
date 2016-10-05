using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net;
using System.IO;

namespace mvp_photom
{

    public partial class Form1 : Form
    {
        HttpListener listener;
        
        public Form1()
        {
            InitServer();
            InitializeComponent();
        }

        public void InitServer()
        {
            listener = new HttpListener();
            listener.Prefixes.Add("http://+:4200/");
            listener.Start();
            handleRequest();
        }

        public delegate void ControlStringConsumer(object obj);  // defines a delegate type

        public void addList(object obj)
        {
            if (InvokeRequired)
            {
                Invoke(new ControlStringConsumer(addList), obj);  // invoking itself
            }
            else
            {
                listBox1.Items.Add(obj);
            }
        }

        async public void handleRequest()
        {
            HttpListenerContext context = await listener.GetContextAsync();
            var requestHandler = new RequestHandler(context);
            if(requestHandler.GetPath() == "/")
            {
                requestHandler.Respond(File.ReadAllText("index.html"));
            }
            /* else if(requestHandler.GetPath() == "/img")
             {
                 addList(new RequestHandler(context));
             }
             else
             {
                 requestHandler.Respond("");
             }*/
            else
            {
                addList(requestHandler);
            }

            

            handleRequest();
        }

        RequestHandler selectedItem = null;

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            selectedItem = listBox1.SelectedItem as RequestHandler;
            if (selectedItem == null)
                return;
            Image img = selectedItem.readPost();
            pictureBox1.Image = img;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (selectedItem == null)
                return;

            selectedItem.Respond(textBox1.Text);
            listBox1.Items.Remove(selectedItem);
        }
    }

    public class RequestHandler
    {
        //HttpListenerContext context;
        HttpListenerRequest request;
        HttpListenerResponse response;

        public RequestHandler(HttpListenerContext context)
        {
            request = context.Request;
            response = context.Response;
        }

        public void Respond(string text)
        {
            string responseString = text;
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
            // Get a response stream and write the response to it.
            response.ContentLength64 = buffer.Length;
            System.IO.Stream output = response.OutputStream;
            output.Write(buffer, 0, buffer.Length);
            output.Flush();
            output.Close();
        }

        public string GetPath()
        {
            return request.Url.AbsolutePath;
        }

        public Image readPost()
        {
            /*byte[] imgBuffer = new byte[(int)request.ContentLength64];
            int bytesRead = request.InputStream.Read(imgBuffer, 0, (int)request.ContentLength64);
            string content = System.Text.Encoding.Default.GetString(imgBuffer);
            string headers = "";
            foreach (string header in request.Headers)
                headers += header;*/
            return ReadFile(request.ContentEncoding, GetBoundary(request.ContentType),request.InputStream);
            //string content = new StreamReader(request.InputStream).ReadToEnd();
            //MessageBox.Show("saved");
        }

        public override string ToString()
        {
            try {
                return request.Url.AbsolutePath;
            }
            catch
            {
                return "Unknown";
            }
        }

        private static String GetBoundary(String ctype)
        {
            return "--" + ctype.Split(';')[1].Split('=')[1];
        }

        private static Image ReadFile(Encoding enc, String boundary, Stream input)
        {
            Byte[] boundaryBytes = enc.GetBytes(boundary);
            Int32 boundaryLen = boundaryBytes.Length;



            using (MemoryStream output = new MemoryStream())
            {
                Byte[] buffer = new Byte[1024];
                Int32 len = input.Read(buffer, 0, 1024);
                Int32 startPos = -1;

                // Find start boundary
                while (true)
                {
                    if (len == 0)
                    {
                        throw new Exception("Start Boundaray Not Found");
                    }

                    startPos = IndexOf(buffer, len, boundaryBytes);
                    if (startPos >= 0)
                    {
                        break;
                    }
                    else
                    {
                        Array.Copy(buffer, len - boundaryLen, buffer, 0, boundaryLen);
                        len = input.Read(buffer, boundaryLen, 1024 - boundaryLen);
                    }
                }

                // Skip four lines (Boundary, Content-Disposition, Content-Type, and a blank)
                for (Int32 i = 0; i < 4; i++)
                {
                    while (true)
                    {
                        if (len == 0)
                        {
                            throw new Exception("Preamble not Found.");
                        }

                        startPos = Array.IndexOf(buffer, enc.GetBytes("\n")[0], startPos);
                        if (startPos >= 0)
                        {
                            startPos++;
                            break;
                        }
                        else
                        {
                            len = input.Read(buffer, 0, 1024);
                        }
                    }
                }

                Array.Copy(buffer, startPos, buffer, 0, len - startPos);
                len = len - startPos;

                while (true)
                {
                    Int32 endPos = IndexOf(buffer, len, boundaryBytes);
                    if (endPos >= 0)
                    {
                        if (endPos > 0) output.Write(buffer, 0, endPos);
                        break;
                    }
                    else if (len <= boundaryLen)
                    {
                        throw new Exception("End Boundaray Not Found");
                    }
                    else
                    {
                        output.Write(buffer, 0, len - boundaryLen);
                        Array.Copy(buffer, len - boundaryLen, buffer, 0, boundaryLen);
                        len = input.Read(buffer, boundaryLen, 1024 - boundaryLen) + boundaryLen;
                    }
                }

                return Image.FromStream(output);
            }


        }

        private static Int32 IndexOf(Byte[] buffer, Int32 len, Byte[] boundaryBytes)
        {
            for (Int32 i = 0; i <= len - boundaryBytes.Length; i++)
            {
                Boolean match = true;
                for (Int32 j = 0; j < boundaryBytes.Length && match; j++)
                {
                    match = buffer[i + j] == boundaryBytes[j];
                }

                if (match)
                {
                    return i;
                }
            }

            return -1;
        }


    }
}
