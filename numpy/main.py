import numpy as np

solution = np.array([0.5, 0.1, -0.3])
def f(w):
	return -np.sum(pow((w - solution), 2))

npop = 50
sigma = 0.1
alpha = 0.001
w = np.random.randn(3)

for i in range(1000):
	if i % 20 == 0:
		print('iter %d. w: %s, solution: %s, reward: %f' % (i, str(w), str(solution), f(w)))

	N = np.random.randn(npop, 3)
	R = np.zeros(npop)
	for j in range(npop):
		w_try = w + sigma * N[j]
		R[j] = f(w_try)
	A = (R - np.mean(R)) / np.std(R)
	w = w + alpha / (npop * sigma) * np.dot(N.T, A)
