# Copyright 2015 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""A simple MNIST classifier which displays summaries in TensorBoard.
 This is an unimpressive MNIST model, but it is a good example of using
tf.name_scope to make a graph legible in the TensorBoard graph explorer, and of
naming summary tags so that they are grouped meaningfully in TensorBoard.
It demonstrates the functionality of every TensorBoard dashboard.
"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import sys

import tensorflow as tf

from tensorflow.examples.tutorials.mnist import input_data

FLAGS = None

def train():
	mnist = input_data.read_data_sets(FLAGS.data_dir, one_hot=True, fake_data=FLAGS.fake_data)
	sess = tf.Session()
	x = tf.placeholder(tf.float32, shape=[None, 784])
	y_ = tf.placeholder(tf.float32, shape=[None, 10])
	W = tf.Variable(tf.zeros([784, 10]))
	b = tf.Variable(tf.zeros([10]))
	sess.run(tf.global_variables_initializer())

	y = tf.matmul(x, W) + b

	cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(y, y_))
	train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entropy)

	for i in range(1000):
		batch_xs, batch_ys = mnist.train.next_batch(100)
		sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})
	correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
	error = 1 - tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
	print("Error:", sess.run(error, feed_dict={x: mnist.test.images, y_: mnist.test.labels}))


def main(_):
	if tf.gfile.Exists(FLAGS.log_dir):
		tf.gfile.DeleteRecursively(FLAGS.log_dir)
	tf.gfile.MakeDirs(FLAGS.log_dir)
	train()


if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('--fake_data', nargs='?', const=True, type=bool,
						default=False,
						help='If true, uses fake data for unit testing.')
	parser.add_argument('--max_steps', type=int, default=1000,
						help='Number of steps to run trainer.')
	parser.add_argument('--learning_rate', type=float, default=0.001,
						help='Initial learning rate')
	parser.add_argument('--dropout', type=float, default=0.9,
						help='Keep probability for training dropout.')
	parser.add_argument('--data_dir', type=str, default='/tmp/playground/tensorflow/mnist/input_data',
						help='Directory for storing input data')
	parser.add_argument('--log_dir', type=str, default='/tmp/playground/tensorflow/mnist/logs/mnist_with_summaries',
						help='Summaries log directory')
	FLAGS, unparsed = parser.parse_known_args()
	tf.app.run(main=main, argv=[sys.argv[0]] + unparsed)