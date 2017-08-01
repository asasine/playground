using System;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Playground
{
    public class Program
    {
        private const string CONNECTION_STRING = "foo";

        private const string QUEUE_NAME = "operations";

        public static void Main()
        {
            Console.WriteLine("Hello World!");
            Task.Run(async () =>
            {
                await MainAsync();
            }).GetAwaiter().GetResult();
        }

        private static async Task MainAsync()
        {
            var storageAccount = CloudStorageAccount.Parse(CONNECTION_STRING);
            var queueClient = storageAccount.CreateCloudQueueClient();
            var queue = queueClient.GetQueueReference(QUEUE_NAME);
            await queue.CreateIfNotExistsAsync();

            foreach (var operationType in (OperationType[])Enum.GetValues(typeof(OperationType)))
            {
                var message = new Message
                {
                    Count = 0,
                    CreationTime = DateTimeOffset.UtcNow,
                    UpdatedTime = DateTimeOffset.UtcNow,
                    OperationType = operationType
                };
                var json = JsonConvert.SerializeObject(message);
                var queueMessage = new CloudQueueMessage(json);
                await queue.AddMessageAsync(queueMessage);
            }

            var messageHandler = new MessageHandler(CONNECTION_STRING);

            await messageHandler.HandleMessages(QUEUE_NAME);
        }
    }

    public class MessageHandler
    {
        private readonly TimeSpan _waitTime = TimeSpan.FromSeconds(5);
        private readonly string _connectionString;
        private const double DELETE_PROBABILITY = 0.20;
        private const double SUCCESS_PROBABILITY = 0.75;
        private const int MAX_RETRY_COUNT = 10;

        public MessageHandler(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task HandleMessages(string queueName)
        {
            var storageAccount = CloudStorageAccount.Parse(_connectionString);
            var queueClient = storageAccount.CreateCloudQueueClient();
            var queue = queueClient.GetQueueReference(queueName);
            if (!await queue.ExistsAsync())
            {
                Console.WriteLine($"Queue {queueName} does not exist, exiting.");
                return;
            }
            Console.WriteLine($"Handling messages to queue {queueName}");

            var random = new Random();
            var retryCount = 0;

            while (true)
            {
                var queueMessage = await queue.GetMessageAsync();
                if (queueMessage == null)
                {
                    Console.WriteLine($"No message in queue {queueName}, retrying . . .");
                    if (retryCount < MAX_RETRY_COUNT)
                    {
                        retryCount += 1;
                        await Task.Delay(_waitTime);
                    }
                    else
                    {
                        Console.WriteLine("Max retries reached, exiting . . ");
                        break;
                    }
                }
                else
                {
                    retryCount = 0;
                    var json = queueMessage.AsString;
                    var message = JsonConvert.DeserializeObject<Message>(json);
                    Console.WriteLine($"Dequeued message: {json}");
                    if (random.NextDouble() < SUCCESS_PROBABILITY)
                    {
                        Console.WriteLine("Message processed successfully.");
                        message.IncrementCounter();
                        json = JsonConvert.SerializeObject(message);
                        queueMessage.SetMessageContent(json);
                        await queue.UpdateMessageAsync(queueMessage, TimeSpan.Zero, MessageUpdateFields.Visibility | MessageUpdateFields.Content);

                    }
                    else
                    {
                        Console.WriteLine("Message failed to process, retrying . . .");
                        if (random.NextDouble() < DELETE_PROBABILITY)
                        {
                            Console.WriteLine("RNG gods are not in your favor, deleting message instead of retrying.");
                            await queue.DeleteMessageAsync(queueMessage);
                        }
                    }

                    Console.WriteLine($"Waiting {_waitTime} seconds . . .");
                    await Task.Delay(_waitTime);
                }
            }
        }
    }

    public class Message
    {
        public DateTimeOffset CreationTime { get; set; }
        public DateTimeOffset UpdatedTime { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public OperationType OperationType { get; set; }
        public int Count { get; set; }

        public void IncrementCounter()
        {
            Count += 1;
            UpdatedTime = DateTimeOffset.UtcNow;
        }
    }

    public enum OperationType
    {
        Foo,
        Bar,
        Baz
    }
}