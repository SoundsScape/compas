

export default function ArticleSheet() {
	return (
		<article
			ref={articleElement}
			className="mx-auto flex w-[210mm] max-w-full flex-col gap-10 bg-white p-[20mm] text-gray-900 print:w-full print:p-0"
		>
			<h1 className="text-center text-4xl print:text-[24pt]">
				{article.titulo}
			</h1>
			<section className="flex justify-between text-sm print:text-[11pt]">
				<h3>
					Un artículo creado por: <br />{' '}
					<strong>
						{article.apellidos_autor}, {article.nombre_autor}
					</strong>
				</h3>
				<h3>
					Del centro: <br /> <strong>{article.centro}</strong>
				</h3>
				<h3>
					A fecha de: <br />{' '}
					<strong>
						{article.created_at
							? new Intl.DateTimeFormat('es-ES', {
								dateStyle: 'long',
							}).format(new Date(article.created_at))
							: ''}
					</strong>
				</h3>
			</section>

			<section className="flex flex-col gap-8 print:gap-4">
				{article.templates?.map(template => (
					<ArticleTemplate
						key={template.id}
						{...template}
					/>
				))}
			</section>
			<section className="flex flex-col gap-8 print:gap-4">
				<h2 className="text-3xl font-bold print:text-[18pt]">
					Bibliografía
				</h2>
				<ul className="w-full overflow-hidden text-sm print:text-[11pt]">
					{article.bibliografia
						.split('\n')
						.map((line, i, arr) => {
							if (!line) return null;
							const isLink = line.trim().startsWith('http');
							return (
								<li key={i}>
									{isLink ? (
										<a
											href={line}
											target="_blank"
											rel="noopener noreferrer"
										>
											{line}
											{i < arr.length - 1 && <br />}
										</a>
									) : (
										<p>
											{line}
											{i < arr.length - 1 && <br />}
										</p>
									)}
								</li>
							);
						})}
				</ul>
			</section>
		</article>
	)
}
