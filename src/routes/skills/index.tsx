import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import Search from "#/components/Search";
import SkillCard from "#/components/SkillCard";
import type { GetSkillsData } from "#/dataconnect-generated";
import { getSkills } from "#/dataconnect-generated";
import { dataConnect } from "#/lib/firebase";

const productSearchSchema = z.object({
	page: z.coerce.number().int().positive().catch(1),
	q: z
		.string()
		.catch("")
		.transform((value) => value.trim()),
});

const DEFAULT_PAGE_SIZE = 10;

type SearchSkillResult = {
	skills: GetSkillsData["skills"];
	hasNext: boolean;
};

const toSearchPattern = (value: string) =>
	value ? `%${value.replace(/[\\%_]/g, "\\$&")}%` : undefined;

export const searchSkillFn = createServerFn({ method: "GET" })
	.inputValidator(productSearchSchema)
	.handler(async ({ data }): Promise<SearchSkillResult> => {
		const response = await getSkills(dataConnect, {
			searchTerm: toSearchPattern(data.q),
			limit: DEFAULT_PAGE_SIZE + 1,
			offset: (data.page - 1) * DEFAULT_PAGE_SIZE,
		});

		const skills = response.data.skills;

		return {
			skills: skills.slice(0, DEFAULT_PAGE_SIZE),
			hasNext: skills.length > DEFAULT_PAGE_SIZE,
		};
	});

export const Route = createFileRoute("/skills/")({
	component: RouteComponent,
	validateSearch: (search) => productSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ page: search.page, q: search.q }),
	loader: ({ deps }) => searchSkillFn({ data: deps }),
});

function RouteComponent() {
	// search params
	const { q, page } = Route.useSearch();
	const { skills, hasNext } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const hasPrev = page > 1;
	const showPagination = skills.length > 0 || hasPrev;

	const handleQueryChange = (value: string) => {
		if (value === q) return;

		navigate({
			search: (prev) => ({ ...prev, q: value, page: 1 }),
			replace: true,
		});
	};

	const handlePrevPage = () => {
		if (hasPrev) {
			navigate({
				search: (prev) => ({ ...prev, page: page - 1 }),
				replace: true,
			});
		}
	};

	const handleNextPage = () => {
		if (hasNext) {
			navigate({
				search: (prev) => ({ ...prev, page: page + 1 }),
				replace: true,
			});
		}
	};

	return (
		<div id="skills-page">
			<section className="intro">
				<header>
					<h1>
						Explore <span className="text-gradient">Skills</span>{" "}
					</h1>
					<p>
						Browse, filter, and inspect reusable AI capabilities from a single
						registry.
					</p>
				</header>

				<Search
					query={q}
					resultCount={skills.length}
					onQueryChange={handleQueryChange}
				/>

				{/* <Link to="/skills/new" className="btn-secondary">Submit Skill</Link> */}
			</section>

			<section className="results">
				{skills.length > 0 ? (
					<div className="skills-grid">
						{skills.map((skill) => (
							<SkillCard key={skill.id} {...skill} />
						))}
					</div>
				) : (
					<p className="empty-state">
						{q
							? `No skills found for "${q}"`
							: `No skills have been created yet.`}
					</p>
				)}
				{showPagination ? (
					<nav className="pagination" aria-label="Skills pagination">
						<button
							type="button"
							onClick={handlePrevPage}
							disabled={!hasPrev}
							aria-label="Previous page"
						>
							Previous
						</button>
						<span aria-live="polite" className="page-indicator">
							Page {page}
						</span>
						<button
							type="button"
							onClick={handleNextPage}
							disabled={!hasNext}
							aria-label="Next page"
						>
							Next
						</button>
					</nav>
				) : null}
			</section>
		</div>
	);
}
