<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FolderController extends AbstractController
{
    #[Route('/api/folders', name: 'app_get_folder', methods: ['GET'])]
    public function index(): Response
    {
        $finder= new Finder();
        $finder->in($this->getParameter('kernel.project_dir').'/public/' . $_ENV['FILESYSTEMJS_FOLDER'])
            ->directories();
        $dirs = iterator_to_array($finder, false);
        $dirs = array_map(function($d) {
            return $this->toArray($d);
        }, $dirs);
        return $this->json($dirs);
    }

    #[Route('/api/folders', name: 'app_post_folder', methods: ['POST'])]
    public function store(Request $request)
    {
        $parent = json_decode($request->getContent(), true)['parent'];
        $dir = json_decode($request->getContent(), true)['name'];
        $path = ($parent ?? '') . '/' . $dir;
        $filesystem = new Filesystem();
        $filesystem->mkdir($path);
        return $this->json($this->toArray($path));
    }

    #[Route('/api/folders/{folder}', name: 'app_delete_folder', methods: ['DELETE'], requirements: ['folder' => '.*'])]
    public function delete(string $folder): Response
    {
        $filesystem = new Filesystem();
        $filesystem->remove($folder);
        return new Response('', Response::HTTP_NO_CONTENT);
    }

    public function toArray(string $folder): array
    {
        $pathinfo = pathinfo($folder);
        $filesystem = new Filesystem();
        $parent = $filesystem->makePathRelative(
            $pathinfo['dirname'],
            $this->getParameter('kernel.project_dir').'/public/' . $_ENV['FILESYSTEMJS_FOLDER']
        );
        $parent = rtrim($parent, '/');
        return [
            // use the filepath as an ID
            'id' => $parent === '.' ?  $pathinfo['filename'] : $parent . '/' . $pathinfo['filename'],
            'name' => $pathinfo['filename'],
            'parent' => $parent === '.' ? null : $parent
        ];
    }
}
