from setuptools import setup, find_packages

setup(
    name="llm-service",
    version="1.0.0",
    description="Centralized LLM and embeddings service for Novus platform",
    author="Novus Team",
    packages=['llm_service', 'llm_service.app', 'llm_service.app.core', 'llm_service.app.providers'],
    package_dir={'llm_service': '.'},
    install_requires=[
        "langchain-openai>=0.2.14",
        "openai>=1.107.0",
        "pydantic>=2.11.10",
        "pydantic-settings>=2.11.0",
        "python-dotenv>=1.1.1",
        "requests>=2.32.3",
        "sentence-transformers>=5.1.0",
        "numpy>=2.2.6",
        "redis>=5.2.1",
        "xxhash>=3.5.0",
    ],
    python_requires=">=3.10",
    zip_safe=False,
)

