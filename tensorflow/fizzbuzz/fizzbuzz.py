import numpy as np
import tensorflow as tf

NUM_DIGITS = 16
NUM_LAYERS = 1
NUM_HIDDEN = 100
NUM_OUTPUT = 4

BATCH_SIZE = 128
NUM_EPOCH = 1000

# Each input number is a list of its binary digits
def binary_encode(i, num_digits):
	return np.array([i >> d & 1 for d in range(num_digits)])

# One-hot encoding for [number, "fizz", "buzz", "fizzbuzz"]
def fizz_buzz_encode(i):
	if i % 15 == 0:
		return np.array([0, 0, 0, 1])
	elif i % 5 == 0:
		return np.array([0, 0, 1, 0])
	elif i % 3 == 0:
		return np.array([0, 1, 0, 0])
	else:
		return np.array([1, 0, 0, 0])

def fizz_buzz(i, prediction):
	return [str(i), "fizz", "buzz", "fizzbuzz"][prediction]

train_range = range(101, 2 ** NUM_DIGITS)
train_x = np.array([binary_encode(i, NUM_DIGITS) for i in train_range])
train_y = np.array([fizz_buzz_encode(i) for i in train_range])
numbers = np.arange(1, 101)
test_x = np.array([binary_encode(i, NUM_DIGITS) for i in numbers])
test_y_labels = np.array([fizz_buzz_encode(i) for i in numbers])

def weight_variables(shape):
	initial = tf.truncated_normal(shape, stddev=0.1)
	return tf.Variable(initial)

def bias_variables(shape):
	initial = tf.constant(0.1, shape=shape)
	return tf.Variable(initial)

def variable_summaries(var):
	with tf.name_scope('summaries'):
		mean = tf.reduce_mean(var)
		tf.summary.scalar('mean', mean)
		with tf.name_scope('stddev'):
			stddev = tf.sqrt(tf.reduce_mean(tf.square(var - mean)))
		tf.summary.scalar('stddev', stddev)
		tf.summary.scalar('max', tf.reduce_max(var))
		tf.summary.scalar('min', tf.reduce_min(var))
		tf.summary.histogram('histogram', var)

def nn_layer(input_tensor, input_dim, output_dim, layer_name, act=tf.nn.relu):
	with tf.name_scope(layer_name):
		with tf.name_scope('weights'):
			weights = weight_variables([intput_dim, output_dim])
			variable_summaries(weights)
		with tf.name_scope('biases'):
			biases = bias_variable([output_dim])
			variable_summaries(biases)
		with tf.name_scope('Wx_plus_b'):
			preactivate = tf.matmul(input_tensor, weights) + biases
			tf.summary.histogram('pre_activation', preactivate)
		activations = act(preactivate, name='activation')
		tf.summary.histogram('activations', activations)
		return activations

def model(x, NUM_INPUT, NUM_LAYERS, NUM_HIDDEN, NUM_OUTPUT):
	for i in range(NUM_LAYERS):
		if i == 0:
			W = weight_variables([NUM_INPUT, NUM_HIDDEN])
		else:
			W = weight_variables([NUM_HIDDEN, NUM_HIDDEN])
		b = bias_variables([NUM_HIDDEN])
		x = tf.nn.relu(tf.matmul(x, W) + b)

	W_output = weight_variables([NUM_HIDDEN, NUM_OUTPUT])
	b_output = bias_variables([NUM_OUTPUT])

	return tf.matmul(x, W_output) + b_output


x = tf.placeholder(tf.float32, [None, NUM_DIGITS])
y_ = tf.placeholder(tf.float32, [None, NUM_OUTPUT])

net = model(x, NUM_DIGITS, NUM_LAYERS, NUM_HIDDEN, NUM_OUTPUT)

cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(net, y_))
train_op = tf.train.AdamOptimizer(1e-4).minimize(cost)

predict_op = tf.argmax(net, 1)


with tf.Session() as sess:
	sess.run(tf.global_variables_initializer())

	for epoch in range(NUM_EPOCH):
		p = np.random.permutation(range(len(train_x)))
		train_x, train_y = train_x[p], train_y[p]

		for start in range(0, len(train_x), BATCH_SIZE):
			end = start + BATCH_SIZE
			sess.run(train_op, feed_dict={x: train_x[start:end], y_: train_y[start:end]})

		if epoch % 10 == 0:
			print(epoch, 1 - np.mean(np.argmax(train_y, axis=1) == sess.run(predict_op, feed_dict={x: train_x, y_: train_y})))

	test_y = sess.run(predict_op, feed_dict={x: test_x})
	output = np.vectorize(fizz_buzz)(numbers, test_y)

	print(output)
	print("%.5f (test error)" % (1 - np.mean(np.argmax(test_y_labels, axis=1) == test_y)))